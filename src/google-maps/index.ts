import { PlaceLocation } from "./types";

export function addListener(
  instance: Object | null,
  eventName: string,
  handler: Function
): google.maps.MapsEventListener | null {
  if (
    window.google &&
    window.google.maps &&
    window.google.maps.event &&
    instance !== null
  ) {
    return window.google.maps.event.addListener(instance, eventName, handler);
  }
  return null;
}

export const DROP_ANIMATION: google.maps.Animation.DROP | null =
  (window.google &&
    window.google.maps &&
    window.google.maps.Animation &&
    window.google.maps.Animation.DROP) ||
  null;

export async function getDetails(
  placesService: google.maps.places.PlacesService | null,
  request: google.maps.places.PlaceDetailsRequest
): Promise<google.maps.places.PlaceResult | null> {
  return new Promise((resolve, reject) => {
    if (placesService === null) {
      reject({
        type: "MISSING_GOOGLE_MAPS",
        error: "Google maps is not loaded."
      });
      return;
    }

    placesService.getDetails(request, (result, status) => {
      switch (status) {
        case window.google.maps.places.PlacesServiceStatus.INVALID_REQUEST:
          reject({
            type: "INVALID_REQUEST",
            error: "Bad request to Google Maps. Please contact tech support."
          });
          return;
        case window.google.maps.places.PlacesServiceStatus.NOT_FOUND:
          resolve(null);
          return;
        case window.google.maps.places.PlacesServiceStatus.OK:
          resolve(result);
          return;
        case window.google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT:
          reject({
            type: "OVER_QUERY_LIMIT",
            error:
              "Over Google Maps quota. Cannot make any more requests for the day. Please contact tech support."
          });
          return;
        case window.google.maps.places.PlacesServiceStatus.REQUEST_DENIED:
          reject({
            type: "REQUEST_DENIED",
            error:
              "Not allowed to use Google Maps. Please contact tech support."
          });
          return;
        case window.google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR:
          reject({
            type: "UNKNOWN_ERROR",
            error: "Unknown error from Google Maps. Please try again shortly."
          });
          return;
        case window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS:
          resolve(null);
          return;
      }
    });
  });
}

export async function getQueryPredictions(
  autocompleteService: google.maps.places.AutocompleteService | null,
  request: google.maps.places.QueryAutocompletionRequest
): Promise<google.maps.places.QueryAutocompletePrediction[]> {
  return new Promise((resolve, reject) => {
    if (autocompleteService === null) {
      reject({
        type: "MISSING_GOOGLE_MAPS",
        error: "Google maps is not loaded."
      });
      return;
    }

    autocompleteService.getQueryPredictions(request, (result, status) => {
      switch (status) {
        case window.google.maps.places.PlacesServiceStatus.INVALID_REQUEST:
          reject({
            type: "INVALID_REQUEST",
            error: "Bad request to Google Maps. Please contact tech support."
          });
          return;
        case window.google.maps.places.PlacesServiceStatus.NOT_FOUND:
          resolve([]);
          return;
        case window.google.maps.places.PlacesServiceStatus.OK:
          resolve(result);
          return;
        case window.google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT:
          reject({
            type: "OVER_QUERY_LIMIT",
            error:
              "Over Google Maps quota. Cannot make any more requests for the day. Please contact tech support."
          });
          return;
        case window.google.maps.places.PlacesServiceStatus.REQUEST_DENIED:
          reject({
            type: "REQUEST_DENIED",
            error:
              "Not allowed to use Google Maps. Please contact tech support."
          });
          return;
        case window.google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR:
          reject({
            type: "UNKNOWN_ERROR",
            error: "Unknown error from Google Maps. Please try again shortly."
          });
          return;
        case window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS:
          resolve([]);
          return;
      }
    });
  });
}

export function newAutocompleteService(): google.maps.places.AutocompleteService | null {
  if (
    window.google &&
    window.google.maps &&
    window.google.maps.places &&
    window.google.maps.places.AutocompleteService
  ) {
    return new window.google.maps.places.AutocompleteService();
  }
  return null;
}

export function newLatLng(
  latitude: number,
  longitude: number
): google.maps.LatLng | null {
  if (window.google && window.google.maps && window.google.maps.LatLng) {
    return new window.google.maps.LatLng(latitude, longitude);
  }

  return null;
}

export function newMap(
  element: HTMLDivElement,
  options: google.maps.MapOptions
): google.maps.Map | null {
  if (window.google && window.google.maps && window.google.maps.Map) {
    return new window.google.maps.Map(element, options);
  }
  return null;
}

export function newMarker(
  options: google.maps.MarkerOptions
): google.maps.Marker | null {
  if (window.google && window.google.maps && window.google.maps.Marker) {
    return new window.google.maps.Marker(options);
  }
  return null;
}

export function newPlacesService(
  div?: HTMLDivElement | null,
  map?: google.maps.Map | null
): google.maps.places.PlacesService | null {
  if (
    window.google &&
    window.google.maps &&
    window.google.maps.places &&
    window.google.maps.places.PlacesService &&
    (map || div)
  ) {
    return new window.google.maps.places.PlacesService(map || div);
  }

  return null;
}

export function removeListener(
  listener: google.maps.MapsEventListener | null
): void {
  if (
    window.google &&
    window.google.maps &&
    window.google.maps.event &&
    listener !== null
  ) {
    window.google.maps.event.removeListener(listener);
  }
}

export async function geocode(
  geocoder: google.maps.Geocoder | null,
  request: google.maps.GeocoderRequest
): Promise<{ latitude: number; longitude: number }[]> {
  return new Promise((resolve, reject) => {
    if (!geocoder) {
      reject({
        type: "MISSING_GOOGLE_MAPS",
        error: "Google maps is not loaded."
      });
      return;
    }

    geocoder.geocode(request, (results, status) => {
      switch (status) {
        case window.google.maps.GeocoderStatus.ERROR:
          reject({
            type: "ERROR",
            error: "Error from Google Maps. Please contact tech support."
          });
          return;
        case window.google.maps.GeocoderStatus.INVALID_REQUEST:
          reject({
            type: "INVALID_REQUEST",
            error: "Bad request to Google Maps. Please contact tech support."
          });
          return;
        case window.google.maps.GeocoderStatus.OK:
          const resultsCoords = results.map(result => ({
            latitude: result.geometry.location.lat(),
            longitude: result.geometry.location.lng()
          }));
          resolve(resultsCoords);
          return;
        case window.google.maps.GeocoderStatus.OVER_QUERY_LIMIT:
          reject({
            type: "OVER_QUERY_LIMIT",
            error:
              "Over Google Maps quota. Cannot make any more requests for the day. Please contact tech support."
          });
          return;
        case window.google.maps.GeocoderStatus.REQUEST_DENIED:
          reject({
            type: "REQUEST_DENIED",
            error:
              "Not allowed to use Google Maps. Please contact tech support."
          });
          return;
        case window.google.maps.GeocoderStatus.UNKNOWN_ERROR:
          reject({
            type: "UNKNOWN_ERROR",
            error: "Unknown error from Google Maps. Please try again shortly."
          });
          return;
        case window.google.maps.GeocoderStatus.ZERO_RESULTS:
          resolve([]);
          return;
      }
    });
  });
}

function getPlaceAddressComponent(
  place: google.maps.places.PlaceResult,
  addressComponentType: string
) {
  if (place.address_components) {
    const searchResult = place.address_components.find(elem =>
      elem.types.some(type => type === addressComponentType)
    );
    if (searchResult !== undefined) {
      return searchResult.short_name;
    }
  }
  return null;
}

export function placeToLocation(
  place: google.maps.places.PlaceResult | null
): PlaceLocation | null {
  if (place === null || place.geometry === undefined) {
    return null;
  }

  const addressComponents = [
    getPlaceAddressComponent(place, "street_number"),
    getPlaceAddressComponent(place, "route"),
    getPlaceAddressComponent(place, "sub_premise")
  ];
  const address = addressComponents.filter(comp => !!comp).join(" ");
  const city = getPlaceAddressComponent(place, "locality");
  const country = getPlaceAddressComponent(place, "country");
  const id = place.place_id || null;
  const latitude = place.geometry.location.lat();
  const longitude = place.geometry.location.lng();
  const name =
    place.types && place.types.includes("establishment") ? place.name : null;
  const state = getPlaceAddressComponent(place, "administrative_area_level_1");
  const zip = getPlaceAddressComponent(place, "postal_code");

  return {
    address,
    city,
    country,
    id,
    latitude,
    longitude,
    name,
    state,
    zip
  };
}
