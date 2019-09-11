(ns interceptor.app.active-load-query
  (:require [io.pedestal.interceptor :as interceptor]
            [database.active-load-query :as db.alq]
            [clojure.tools.logging :as log]
            [interceptor.util :as util]
            [clojure.spec.alpha :as spec]
            [spec.app.util :as spec.util]
            [io.pedestal.test :as test]
            [spec.app.active-load-query :as spec.alq]))

;get active loads from load1 database
(defn get-loads [database context]
  (let [{loads :activeLoads error :error} (db.alq/active-load-query (:connection database))]
    (if (some? error)
      (let [message "Database query error"]
        (assoc context :response (util/bad-request 502 {:error message}) ))
      (assoc-in context [:request :activeLoads] loads))))

(spec/def :get-loads/request (spec/keys :req-un [::spec.alq/activeLoads]))
(spec/def :get-loads/context (spec/keys :req-un [:get-loads/request]))
(spec/fdef get-loads
           :args (spec/and (spec/cat :database ::spec.util/db-component :context ::spec.alq/input-context))
           :ret (spec/or :context :get-loads/context :error ::spec.alq/context-502))

;interceptor to retrieve active loads from load1 database
(defn get-loads-interceptor
  [database]
  (interceptor/interceptor
    {:name  ::alq-get-loads
     :enter (partial get-loads database)}))

(spec/fdef get-loads-interceptor
           :args (spec/cat :database ::spec.util/db-component)
           :ret ::spec.util/interceptor)

; queries google geocoder to find lat/long for each load's pickups/deliveries
(defn get-loads-coords
  [geo-context context]
  (let [loads (:activeLoads (:request context))
        [no-coords-loads
         has-coords-loads] ((juxt filter remove)
                            (fn [load]
                              (or (nil? (:pickupLatitude load))
                                  (nil? (:deliveryLatitude load))))
                            loads)
        added-coords-loads (db.alq/update-loads-with-coords no-coords-loads geo-context)

        all-loads         (:activeLoads (:request context))]
    (assoc context :request {:activeLoads all-loads
                              :has-coords-loads has-coords-loads
                              :added-coords-loads added-coords-loads})))

(spec/def ::has-coords-loads (spec/coll-of ::spec.alq/load))
(spec/def ::added-coords-loads  (spec/coll-of ::spec.alq/load))
(spec/def :loads/context (spec/keys :req-un [:loads/request]))
(spec/def :loads/request (spec/keys :req-un [::spec.alq/activeLoads]))
(spec/def :split-loads/request (spec/keys :req-un [::spec.alq/activeLoads ::has-coords-loads ::added-coords-loads]))
(spec/def :split-loads/context (spec/keys :req-un [:split-loads/request]))
(spec/fdef get-loads-coords
           :args (spec/and (spec/cat :geo-context ::spec.util/geo-context :context :loads/context))
           :ret :split-loads/context)

; interceptor to query google geocder for loads coords
(defn get-loads-coords-interceptor
  [google-geocoder]
  (interceptor/interceptor
    {:name  ::alq-get-coords
     :enter (fn [context]
              (get-loads-coords google-geocoder context))}))

(spec/fdef get-loads-coords-interceptor
           :args (spec/cat :geo-context ::spec.util/geo-context)
           :ret ::spec.util/interceptor)

; updates the coords for locations that don't have lat/longs in the location database
(defn update-loads-coords
  [database context]
  (let [request (:request context)
        added-coords-loads (:added-coords-loads request)
        has-coords-loads (:has-coords-loads request)
        conn (:connection database)
        {error :error} (db.alq/update-database-with-coords added-coords-loads conn)]
    (if (some? error)
      (let [message "Database query error"]
        (assoc context :response (util/bad-request 502 {:error message})))
      (assoc context :response {:status  200
                                :headers {}
                                :body    {:activeLoads (into added-coords-loads has-coords-loads)}}))))

(spec/fdef update-loads-coords
           :args (spec/and (spec/cat :database ::spec.util/db-component :context :split-loads/context))
           :ret (spec/or :context ::spec.alq/context-502 :context ::spec.alq/context-200))

; interceptor to update coords in location database
(defn update-loads-coords-interceptor
  [database]
  (interceptor/interceptor
    {:name  ::alq-update-load-coords
     :enter (partial update-loads-coords database)}))

(spec/fdef update-loads-coords-interceptor
           :args (spec/and (spec/cat :database ::spec.util/db-component))
           :ret ::spec.util/interceptor)
