import { Load, Location } from "./types";
import { statesAndCodes } from "./util";

// used for delivery and pickup city TODO delete if the filters are later removed
// function filterByCity(
//   city: string
// ): (load: { pickup: Location; delivery: Location }) => boolean {
//   return load =>
//     load.pickup.city.toLowerCase().includes(city.toLowerCase()) ||
//     load.delivery.city.toLowerCase().includes(city.toLowerCase());
// }

// filters loads by a list of cities
export function filterByCities(
  locationType: string,
  cities: string[]
): (load: { pickup: Location; delivery: Location }) => boolean {
  return load => {
    if (cities.length === 0) {
      return true;
    }
    let foundMatch = false;

    // if location types has not been selected, apply filter to both
    // pickups and deliveries
    if (locationType === null || locationType === "") {
      cities.forEach(city => {
        if (load.pickup.city === city || load.delivery.city === city) {
          foundMatch = true;
        }
      });
    }
    // if locationType was selected, apply the filter to either pickups or
    // deliveries
    else {
      const chosenLocation: Location =
        locationType === "Pickups" ? load.pickup : load.delivery;
      cities.forEach(city => {
        if (chosenLocation.city === city) {
          foundMatch = true;
        }
      });
    }
    return foundMatch;
  };
}

// filter by state/s
export function filterByStates(
  locationType: string,
  states: string[]
): (load: { pickup: Location; delivery: Location }) => boolean {
  return load => {
    if (states.length === 0) {
      return true;
    }
    let foundMatch = false;

    // if location types has not been selected, apply filter to both
    // pickups and deliveries
    if (locationType === null || locationType === "") {
      states.forEach(state => {
        if (
          statesAndCodes[state] &&
          (statesAndCodes[state] === load.pickup.state ||
            statesAndCodes[state] === load.delivery.state)
        ) {
          foundMatch = true;
        }
      });
    }
    // if locationType was selected, apply the filter to either pickups or
    // deliveries
    else {
      const chosenLocation: Location =
        locationType === "Pickups" ? load.pickup : load.delivery;
      states.forEach(state => {
        if (
          statesAndCodes[state] &&
          statesAndCodes[state] === chosenLocation.state
        ) {
          foundMatch = true;
        }
      });
    }
    return foundMatch;
  };
}

// filter by mode/s
export function filterByModes(modes: string): (load: Load) => boolean {
  return load => (modes.length > 0 ? modes.includes(load.mode) : true);
}

// filter by trasit status/es
export function filterByTransitStatus(
  statuses: string[]
): (load: Load) => boolean {
  return load =>
    statuses.length > 0 ? statuses.includes(load.transitStatus) : true;
}

// filter based on whether load has pending carrier or not
export function filterByCarrierAssigned(
  input: string
): (load: Load) => boolean {
  return load => {
    switch (input) {
      case "Assigned":
        return load.transitStatus !== "Pending";
      case "Not Assigned":
        return load.transitStatus === "Pending";
      default:
        return true;
    }
  };
}

// filters if load's pickup or delivery is within range of a location
export function filterByRange(
  locationType: string,
  range: number,
  center: google.maps.LatLng | null
): (load: Load) => boolean {
  return load => {
    if (center === null) {
      return true;
    }
    if (
      load.pickup.latitude &&
      load.pickup.longitude &&
      load.delivery.latitude &&
      load.delivery.longitude
    ) {
      // if location type has not been selected, apply filter to both
      // pickups and deliveries
      if (locationType === "" || locationType === null) {
        // find distance between location and center (in degrees)
        const pickupDistance = Math.sqrt(
          Math.pow(load.pickup.latitude - center.lat(), 2) +
            Math.pow(load.pickup.longitude - center.lng(), 2)
        );
        const deliveryDistance = Math.sqrt(
          Math.pow(load.delivery.latitude - center.lat(), 2) +
            Math.pow(load.delivery.longitude - center.lng(), 2)
        );
        if (pickupDistance * 69 <= range || deliveryDistance * 69 <= range) {
          //69 is the conversion from degrees (lat/long) to miles
          return true;
        }
      }
      // apply the range filter to only the location type selected
      else {
        const chosenLocation: Location =
          locationType === "Pickups" ? load.pickup : load.delivery;
        const locationDistance = Math.sqrt(
          Math.pow(chosenLocation.latitude - center.lat(), 2) +
            Math.pow(chosenLocation.longitude - center.lng(), 2)
        );

        if (locationDistance * 69 <= range) {
          //69 is the conversion from degrees (lat/long) to miles
          return true;
        }
      }
    }
    return false;
  };
}

// filter for if a pickup or delivery is within a date range
export function filterByDate(
  startDate: Date | null | undefined,
  endDate: Date | null | undefined,
  locationType: string
): (load: { pickup: Location; delivery: Location; id: string }) => boolean {
  return load => {
    // if not date selected in the filter
    if (
      (startDate === null || typeof startDate === "undefined") &&
      (endDate === null || typeof endDate === "undefined")
    ) {
      return true;
    }

    // choose to filter pickup or delivery
    let loadDate: Date | null;
    if (locationType === "pickup") {
      loadDate = load.pickup.date;
    } else {
      loadDate = load.delivery.date;
    }

    // check if load's date is null
    if (loadDate === null) {
      return false;
    }

    //check start date
    if (
      startDate !== null &&
      typeof startDate !== "undefined" &&
      loadDate < (startDate as Date)
    ) {
      return false;
    }

    //check end date
    if (
      endDate !== null &&
      typeof endDate !== "undefined" &&
      loadDate > (endDate as Date)
    ) {
      return false;
    }

    return true;
  };
}
