import React from "react";

import moment from "moment";
import { List, Collection } from "immutable";

import { Load, Location, OverlappingLocations } from "./types";
import { timeZoneBounds } from "./util";
import { Segment, Dimmer, Loader } from "semantic-ui-react";

const segmentStyle = { margin: 0, padding: 0, border: "none" };
const dimmerStyle = { backgroundColor: "rgba(120,120,120,0.4)" };

/*
Google Maps with makers and overlays for traffic/weather/transit arcs, and 
time zones. 
*/
export const LoadMap: React.FC<{
  loading: boolean;
  loads: Collection.Indexed<Load>;
  arcsToggle: boolean;
  timeZoneToggle: boolean;
  weatherToggle: boolean;
  trafficToggle: boolean;
  locationType: string;
  
}> = React.memo(
  ({
    loading,
    loads,
    arcsToggle,
    timeZoneToggle,
    weatherToggle,
    trafficToggle,
    locationType
  }) => {
    const mapElementRef = React.useRef<HTMLDivElement>(null);
    const mapRef = React.useRef<google.maps.Map | null>(null);
    const KMLLayerRef: React.MutableRefObject<null | google.maps.KmlLayer> = React.useRef(
      null
    );
    const [timeZoneOverlays, setTimeZones] = React.useState<
      google.maps.GroundOverlay[][]
    >([[]]);

    // initialize map, weather layer, and time zone layer
    React.useEffect(() => {
      // map
      mapRef.current = new window.google.maps.Map(mapElementRef.current, {
        gestureHandling: 'cooperative',
        center: { lat: 41.492, lng: -103.13 },
        zoom: 4
      });

      // weather layer
      KMLLayerRef.current = new window.google.maps.KmlLayer({
        preserveViewport: true,
        url: "https://aa.avalogistics.com/noaa-latest-radar.kml"
      });

      // time zones (hide them by default)
      if (mapRef.current) {
        setTimeZones(
          timeZoneBounds.map((timeZone, index) => {
            let img = "../";
            switch (index) {
              case 0:
                img += "zero_black.png";
                break;
              case 1:
                img += "one_black.png";
                break;
              case 2:
                img += "two_black.png";
                break;
              case 3:
                img += "three_black.png";
                break;
              case 4:
                img += "four_black.png";
                break;
              case 5:
                img += "four_half_black.png";
                break;
            }

            return timeZone.map(
              bounds => new window.google.maps.GroundOverlay(img, bounds)
            );
          })
        );

        // check if DST is active to determine which file to use
        if (moment().isDST()) {
          mapRef.current.data.loadGeoJson("../time_zone_dst.json");
        } else {
          mapRef.current.data.loadGeoJson("../time_zone_no_dst.json");
        }
        mapRef.current.data.setStyle({ visible: false });
      }
    }, []);

    // time zone toggle effect
    React.useEffect(() => {
      if (mapRef.current) {
        // paint time zones
        if (timeZoneToggle) {
          mapRef.current.data.setStyle(feature => {
            let color = "gray";
            if (feature.getProperty("color")) {
              color = feature.getProperty("color");
            }
            return {
              fillColor: color,
              strokeColor: color,
              strokeWeight: 1
            };
          });

          timeZoneOverlays.forEach(timeZone =>
            timeZone.forEach(overlay => overlay.setMap(mapRef.current))
          );
        }

        // hide time zones
        else {
          mapRef.current.data.setStyle({ visible: false });

          timeZoneOverlays.forEach(timezone =>
            timezone.forEach(overlay => overlay.setMap(null))
          );
        }
      }
    }, [timeZoneToggle, timeZoneOverlays]);

    // weather layer toggle effect
    React.useEffect(() => {
      if (KMLLayerRef.current) {
        if (weatherToggle) {
          KMLLayerRef.current.setMap(mapRef.current);
        } else {
          KMLLayerRef.current.setMap(null);
        }
      }
    }, [weatherToggle]);

    // traffic layer toggle effect
    React.useEffect(() => {
      const trafficLayer = new window.google.maps.TrafficLayer();
      if (trafficToggle) {
        trafficLayer.setMap(mapRef.current);
      }

      return () => {
        trafficLayer.setMap(null);
      };
    }, [trafficToggle]);

    // make and plot load markers + arcs (with locationType filter)
    React.useEffect(() => {
      const loadsInTransit = loads.filter(
        load => load.transitStatus === "Travelling"
      );

      let arcs: Collection.Indexed<google.maps.Polyline>;

      let loadsHashTable = new Map<string, OverlappingLocations>();
      let allMarkers: List<google.maps.Marker> = List([]);

      // set up markers
      if (mapRef.current !== null) {
        let map = mapRef.current;

        // set up hash table
        loads.forEach(load => {
          // add delivery
          if (locationType === "Deliveries" || locationType === "") {
            const deliveryString = (
              load.delivery.city + load.delivery.zip
            ).toLowerCase();

            // update hash table
            if (loadsHashTable.has(deliveryString)) {
              let location = loadsHashTable.get(
                deliveryString
              ) as OverlappingLocations;

              location.deliveries = location.deliveries.push(load.delivery);
              loadsHashTable = loadsHashTable.set(deliveryString, location);
            }

            // add to hash table
            else {
              loadsHashTable = loadsHashTable.set(deliveryString, {
                pickups: List([]),
                deliveries: List([load.delivery])
              });
            }
          }

          // add pickup
          if (locationType === "Pickups" || locationType === "") {
            const pickupString = (
              load.pickup.city + load.pickup.zip
            ).toLowerCase();

            // update hash table
            if (loadsHashTable.has(pickupString)) {
              let location = loadsHashTable.get(
                pickupString
              ) as OverlappingLocations;

              location.pickups = location.pickups.push(load.pickup);
              loadsHashTable = loadsHashTable.set(pickupString, location);
            }

            // add to hash table
            else {
              loadsHashTable = loadsHashTable.set(pickupString, {
                pickups: List([load.pickup]),
                deliveries: List([])
              });
            }
          }
        });

        // compile all markers together
        for (let value of loadsHashTable.values()) {
          let returnedMarkers = plotLoadsAtSameLocation(
            map,
            value.pickups,
            value.deliveries
          );
          allMarkers = allMarkers.concat(returnedMarkers);
        }
      }

      //plot arcs
      if (arcsToggle && locationType === "" && mapRef.current) {
        // separate, then zip together pickup and deliveries as LatLngs
        const inTransitPickupCoords = loadsInTransit.map(
          load =>
            new window.google.maps.LatLng(
              load.pickup.latitude,
              load.pickup.longitude
            )
        );
        const inTransitDeliveriesCoords = loadsInTransit.map(
          load =>
            new window.google.maps.LatLng(
              load.delivery.latitude,
              load.delivery.longitude
            )
        );

        // zipped pickup and delivery coords
        const inTransitCoords: Collection.Indexed<
          google.maps.LatLng[]
        > = inTransitPickupCoords.zip(inTransitDeliveriesCoords);

        // plot arcs
        arcs = inTransitCoords.map(path => {
          const polyLine: google.maps.Polyline = new window.google.maps.Polyline(
            {
              strokeColor: "#FF0000",
              strokeOpacity: 0.2,
              strokeWeight: 1.5,
              map: mapRef.current,
              geodesic: true
            }
          );
          polyLine.setPath(path);
          return polyLine;
        });
      }

      // remove markers and arcs
      return () => {
        if (allMarkers) {
          allMarkers.forEach(marker => marker.setMap(null));
        }
        if (arcs) {
          arcs.forEach(arc => arc.setMap(null));
        }
      };
    }, [loads, locationType, arcsToggle]);

    return (
      <Segment style={segmentStyle}>
        <Dimmer active={loading} style={dimmerStyle}>
          <Loader active={loading}>Loading Loads</Loader>
        </Dimmer>
        <div id="ActiveLoadMap" ref={mapElementRef} />
      </Segment>
    );
  }
);

// takes pickups and deliveries that are at the same location and plots
// markers around that location (avoiding overlap)
function plotLoadsAtSameLocation(
  map: google.maps.Map,
  pickups: List<Location>,
  deliveries: List<Location>
): List<google.maps.Marker> {
  let baseLat: number;
  let baseLong: number;

  // get central location (to arrange markers around)
  if (deliveries.isEmpty()) {
    baseLat = (pickups.first() as Location).latitude;
    baseLong = (pickups.first() as Location).longitude;
  } else {
    baseLat = (deliveries.first() as Location).latitude;
    baseLong = (deliveries.first() as Location).longitude;
  }

  // plot pickups
  const pickupMarkers = plotLoadsWithOffset(
    map,
    pickups,
    baseLat,
    baseLong,
    0,
    1 / 1000 // 1/1000 is an arbitarily chosen distance
  );

  // calculate new angle and radius after making pickup markers
  const newAngle = (Math.PI / 4) * (pickups.count() % 8);
  // 8 is arbitrary in chosen; 8 markers in one "circle"
  const newRadius = Math.ceil(pickups.count() / 8) / 1000;

  // plot deliveries
  const deliveryMarkers = plotLoadsWithOffset(
    map,
    deliveries,
    baseLat,
    baseLong,
    newAngle,
    newRadius
  );

  return pickupMarkers.concat(deliveryMarkers);
}

// takes list of locations at same lat/long and plots
// them in a circle around that location
function plotLoadsWithOffset(
  map: google.maps.Map,
  loads: List<Location>,
  baseLat: number,
  baseLong: number,
  angle: number,
  radius: number
): List<google.maps.Marker> {
  return loads.map((load, index) => {
    //calculate new location
    let newAngle = angle + (index * Math.PI) / 4;
    radius = ((Math.floor(newAngle / (2 * Math.PI)) + 1) * 1) / 1000;
    const newLat = baseLat + radius * Math.sin(newAngle);
    const newLong = baseLong + radius * Math.cos(newAngle);

    // plot coord
    return plotCoordsFromLocation(
      { ...load, latitude: newLat, longitude: newLong },
      map,
      load.locationType === "delivery"
    );
  });
}

// puts down marker for one location
function plotCoordsFromLocation(
  location: Location,
  map: google.maps.Map,
  isDeliveries: boolean
): google.maps.Marker {
  let markerIcon: string;
  if (isDeliveries) {
    switch (location.transitStatus) {
      case "At Delivery":
        markerIcon = "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
        break;
      case "Travelling":
        markerIcon = "https://maps.google.com/mapfiles/ms/icons/orange-dot.png";
        break;
      default:
        markerIcon = "https://maps.google.com/mapfiles/ms/icons/red-dot.png";
        break;
    }
  } else {
    markerIcon = "https://maps.google.com/mapfiles/ms/icons/blue-dot.png";
  }

  const marker: google.maps.Marker = new window.google.maps.Marker({
    position: new window.google.maps.LatLng(
      location.latitude,
      location.longitude
    ),
    map: map,
    icon: markerIcon
  });

  var infowindow = new window.google.maps.InfoWindow({
    content: createMarkerText(location, isDeliveries)
  });

  marker.addListener("click", function() {
    infowindow.open(map, marker);
  });

  return marker;
}

// formats the marker text for a location
function createMarkerText(location: Location, isDeliveries: boolean): string {
  const deliveryDate = isDeliveries
    ? location.date
    : location.correspondingLocDate;
  const pickupDate = isDeliveries
    ? location.correspondingLocDate
    : location.date;

  let contentString = `<div id="content"> 
    <b>Load ID: </b> ${location.id}
    <br>
    <b>Carrier Name: </b> ${
      location.carrierName ? location.carrierName : "Not found"
    }
    <br>
    <b>Carrier Contact: </b> ${
      location.carrierContact ? location.carrierContact : "Not found"
    }
    <br>
    <b>Driver Contact: </b> ${
      location.driverContact ? location.driverContact : "Not found"
    }
    <br>
    <b> Equipment: </b> ${location.equipment ? location.equipment : "Not found"}
    <br>
    <hr>
    <b> Pickup Date: </b> ${
      pickupDate ? pickupDate.toDateString() : "Not found"
    }
    <br>
    <b> Delivery Date: </b> ${
      deliveryDate ? deliveryDate.toDateString() : "Not found"
    }
    <br>
    <b>${isDeliveries ? "Pickup Location: " : "Delivery Location:"}</b> ${
    location.correspondingLocStr
  }
    </div>`;
  return contentString;
}

export default LoadMap;
