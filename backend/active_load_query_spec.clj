(ns spec.app.active-load-query
  (:require [clojure.spec.alpha :as s]
            [clojure.spec.gen.alpha :as gen]
            [clojure.spec.alpha :as spec]))

(spec/def ::pickupId (spec/or :number number? :nil nil?))
(spec/def ::deliveryId (spec/or :number number? :nil nil?))
(spec/def ::pickupLatitude (spec/or :number number? :nil nil?))
(spec/def ::pickupLongitude (spec/or :number number? :nil nil?))
(spec/def ::deliveryLatitude (spec/or :number number? :nil nil?))
(spec/def ::deliveryLongitude (spec/or :number number? :nil nil?))

(spec/def ::carrierName (spec/or :string string? :nil nil?))
(spec/def ::carrierContact (spec/or :string string? :nil nil?))
(spec/def ::driverContact (spec/or :string string? :nil nil?))
(spec/def ::equipment (spec/or :string string? :nil nil?))

(spec/def ::id (spec/or :number number? :nil nil?))
(spec/def ::supportStatus (spec/or :str string? :nil nil?))
(spec/def ::transitStatus (spec/or :str string? :nil nil?))
(spec/def ::mode (spec/or :str string? :nil nil?))

(spec/def ::pickupStartTime (spec/or :str string? :nil nil?))
(spec/def ::pickupEndTime (spec/or :str string? :nil nil?))
(spec/def ::pickupDate (spec/or :inst inst? :nil nil?))
(spec/def ::pickupCity (spec/or :str string? :nil nil?))
(spec/def ::pickupState (spec/or :str string? :nil nil?))
(spec/def ::pickupCountry (spec/or :str string? :nil nil?))
(spec/def ::pickupZip (spec/or :str string? :nil nil?))

(spec/def ::deliveryStartTime (spec/or :str string? :nil nil?))
(spec/def ::deliveryEndTime (spec/or :str string? :nil nil?))
(spec/def ::deliveryDate (spec/or :inst inst? :nil nil?))
(spec/def ::deliveryCity (spec/or :str string? :nil nil?))
(spec/def ::deliveryState (spec/or :str string? :nil nil?))
(spec/def ::deliveryCountry (spec/or :str string? :nil nil?))
(spec/def ::deliveryZip (spec/or :str string? :nil nil?))

(spec/def ::load (spec/keys :req-un [::id ::carrierName ::carrierContact ::driverContact ::equipment ::supportStatus ::transitStatus ::mode ::pickupDate ::pickupStartTime ::pickupEndTime
                                     ::pickupCity ::pickupState ::pickupCountry ::pickupZip ::deliveryStartTime
                                     ::deliveryEndTime ::deliveryDate ::deliveryCity ::deliveryState ::deliveryCountry
                                     ::deliveryZip ::pickupId ::deliveryId ::pickupLatitude ::pickupLongitude ::deliveryLatitude ::deliveryLongitude]))
(spec/def ::activeLoads (spec/coll-of ::load))

(spec/def :200/body (spec/keys :req-un [::activeLoads]))
(spec/def :200/status #{200})
(spec/def :200/headers #{{}})
(spec/def :200/response (spec/keys :req-un [:200/body :200/headers :200/status]))

(spec/def ::input-context (spec/keys :req-un []))
(spec/def ::context-200 (spec/keys :req-un [:200/response]))
(spec/def ::context-502
  #{{:response {:status  502
                :headers {}
                :body    {:error "Database query error"}}}})