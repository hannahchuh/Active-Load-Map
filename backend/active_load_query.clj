(ns database.active-load-query
  (:require
    [clojure.java.jdbc :as jdbc]
    [clojure.spec.alpha :as spec]
    [clojure.tools.logging :as log]
    [honeysql.core :as sql]
    [honeysql.helpers :as helpers]
    [spec.app.active-load-query :as spec.alq]
    [spec.app.util :as spec.util])
  (:import
    (com.google.maps GeoApiContext GeoApiContext$Builder GeocodingApi)
    (java.util Date)))

;format for sql query to get active loads
(def sql-query {:select [[:shipment.id :id]
                         [:shipment.carrier_name :carrierName]
                         [:shipment.driverName :carrierContact]
                         [:shipment.driverPhone :driverContact]
                         [:shipment.equipment :equipment]
                         [:shipment.loadStatus :supportStatus]
                         [:shipment.locationStatus :transitStatus]
                         [:shipment.transport :mode]
                         [:shipment.pickupTime1 :pickupStartTime]
                         [:shipment.pickupTime2 :pickupEndTime]
                         [:pickup.city :pickupCity]
                         [:pickup.state :pickupState]
                         [:pickup.country :pickupCountry]
                         [:pickup.zip :pickupZip]
                         [:pickup.longitude :pickupLongitude]
                         [:pickup.latitude :pickupLatitude]
                         [:pickup.id :pickupId]
                         :pickupDate                        ;; [(sql/raw ["FROM_UNIXTIME(pickupDate/1000)"]) :pickupDate]
                         [:shipment.delivTime1 :deliveryStartTime]
                         [:shipment.delivTime2 :deliveryEndTime]
                         [:delivery.city :deliveryCity]
                         [:delivery.state :deliveryState]
                         [:delivery.country :deliveryCountry]
                         [:delivery.zip :deliveryZip]
                         [:delivery.latitude :deliveryLatitude]
                         [:delivery.longitude :deliveryLongitude]
                         [:delivery.id :deliveryId]
                         [:delivDate :deliveryDate]                    ;; [(sql/raw ["FROM_UNIXTIME(delivDate/1000)"]) :deliveryDate]
                         ],
                :from   [[:load1 :shipment]],
                :join   [[:location :pickup] [:= :pickup.id :location_1_id]
                         [:location :delivery] [:= :delivery.id :location_2_id]],
                :where  [:and
                         [:or
                          [:!= :shipment.locationStatus "On Hold"]
                          [:is :shipment.locationStatus nil]]
                         [:or
                          [:!= :shipment.locationStatus "Delivered"]
                          [:is :shipment.locationStatus nil]]
                         [:or
                          [:!= :shipment.loadStatus "Cancelled"]
                          [:is :shipment.loadStatus nil]]
                         [:or
                          [:!= :shipment.loadStatus "VNU"]
                          [:is :shipment.loadStatus nil]]]})

; queries google maps api and returns lat/long for a coord
(defn load-coords-query
  ([address-string geo-context]
   (try
     (let [results     (.await (GeocodingApi/geocode geo-context address-string))
           best-result (first results)]
       (let [latitude  (when (some? best-result) (.-lat (.-location (.-geometry best-result))))
             longitude (when (some? best-result) (.-lng (.-location (.-geometry best-result))))]
         ; put in an if statement here and replace the things with nulls if lat and long are 0
         ; but figure out if these are 0 or 0.0 because it does make a difference
         (if (and (= 0 latitude) (= 0 longitude))
           {:latitude nil :longitude nil}
           {:latitude latitude :longitude longitude})
         ))
     (catch Exception ex
       (do
         (log/error ex (or (.getMessage ex) "Google Geocoding Error"))
         {:error (or (.getMessage ex) "Google Geocoding Error")})))))

; format for inserting coords into the db (DOES NOT INCLUDE "ON DUPLICATE KEY UPDATE")
(defn insert-coords-query-format
  [values]
  {:insert-into :location
   :columns     [:id, :latitude, :longitude]
   :values      values})

; update database with coordinates
(defn update-database-with-coords
  [active-loads database]
  (if (> (count active-loads) 0)
    (let [update-values
          (into (mapv (fn [load] [(:pickupId load) (:pickupLatitude load) (:pickupLongitude load)]) active-loads)
                (mapv (fn [load] [(:deliveryId load) (:deliveryLatitude load) (:deliveryLongitude load)]) active-loads))

          ]
      (let [insert-command (sql/format (insert-coords-query-format update-values))
            update-command (assoc insert-command 0 (str (first insert-command) " ON DUPLICATE KEY UPDATE latitude=VALUES(latitude), longitude=VALUES(longitude);"))]
        (jdbc/with-db-transaction
          [trans-conn database]
          (try {:updated-loads (jdbc/execute! trans-conn update-command)}
               (catch Exception ex
              (do
                (log/error ex (or (.getMessage ex) "Unknown db error."))
                {:error (or (.getMessage ex) "Unknown db error.")}))))))
    {:updated-loads active-loads}))


;returns array of loads that now have coords in them
(defn update-loads-with-coords
  [active-loads geo-context]
  (mapv (fn [load]
          (if (or (nil? (:pickupLatitude load)) (nil? (:pickupLongitude load)) (nil? (:deliveryLatitude load)) (nil? (:deliveryLongitude load)))
            (let [pickup-address (str (:pickupCity load) ", " (:pickupState load) ", " (:pickupZip load))
                  delivery-address (str (:deliveryCity load) ", " (:deliveryState load) ", " (:deliveryZip load))
                  {pick-lat :latitude
                   pick-lng :longitude} (load-coords-query pickup-address geo-context)
                  {deliv-lat :latitude
                   deliv-lng :longitude} (load-coords-query  delivery-address geo-context)]
              (assoc load
                :pickupLatitude pick-lat
                :pickupLongitude pick-lng
                :deliveryLatitude deliv-lat
                :deliveryLongitude deliv-lng))
            load))
        active-loads))

; query database for active loads
(defn active-load-query [db-connection]
  (try
    (let [loads (jdbc/query db-connection (sql/format sql-query) {:identifiers identity})
          ts->utc-date (fn [ms] (when (some? ms) (Date. ms)))
          loads' (map
                   (comp
                     (fn [load] (update load :pickupDate ts->utc-date))
                     (fn [load] (update load :deliveryDate ts->utc-date)))
                   loads)]
      {:activeLoads loads'})
    (catch Exception ex
      (do
        (log/error ex (or (.getMessage ex) "Unknown db error."))
        {:error (or (.getMessage ex) "Unknown db error.")}))))

(spec/def ::active-loads-result (spec/keys :req-un [::spec.alq/activeLoads]))
(spec/def ::latLong (spec/keys :req-un [::latitude ::longitude]))
(spec/def ::latitude (spec/or :number number? :nil nil?))
(spec/def ::longitude (spec/or :number number? :nil nil?))

(spec/fdef load-coords-query
           :args (spec/and (spec/cat :load ::spec.alq/load :geo-context ::spec.util/geo-contest))
           :ret (spec/or :latLong ::latLong :error ::spec.util/error))

(spec/fdef active-load-query
  :args (spec/cat :connection ::spec.util/connection)
  :ret (spec/or :active-loads ::active-loads-result :error ::spec.util/error))

(spec/fdef update-loads-with-coords
  :args (spec/cat :active-loads ::spec.alq/activeLoads
                  :geo-context ::spec.util/geo-context)
  :ret ::spec.alq/activeLoads)

(spec/fdef update-database-with-coords
   :args (spec/and (spec/cat :active-loads ::spec.alq/activeLoads :connection ::spec.util/connection ))
   :ret number?)
