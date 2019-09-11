declare global {
  interface Window {
    google?: any;
    gapi?: any;
  }
}

export interface GAPI {
  load(apiName: string, callback: gapi.CallbackOrConfig): void;
  auth2: {
    getAuthInstance(): gapi.auth2.GoogleAuth;
    init(params: gapi.auth2.ClientConfig): gapi.auth2.GoogleAuth;
  };
}

// for when data is read from database query
export interface UnformmatedLoad {
  searchResult: string;
  pickupId: number | null;
  deliveryId: number | null;
  pickupLatitude: number | null; 
  pickupLongitude: number | null; 
  deliveryLatitude: number | null; 
  deliveryLongitude: number | null; 
  pickupCountry: string | null;
  pickupState: string; //
  supportStatus: string;
  deliveryCountry: string | null;
  pickupZip: string; //
  transitStatus: string;
  pickupEndTime: string | null;
  deliveryEndTime: string | null;
  mode: string;
  pickupDate: string | null;
  pickupCity: string; //
  deliveryState: string; //
  deliveryStartTime: string | null;
  id: string;
  deliveryZip: string; //
  pickupStartTime: string | null;
  deliveryCity: string; //
  deliveryDate: string | null;
  carrierName: string | null;
  carrierContact: string | null;
  driverContact: string | null;
  equipment: string | null;
}

export interface Location {
  locationType: string;
  transitStatus: string;
  carrierName: string | null;
  carrierContact: string | null;
  driverContact: string | null;
  equipment: string | null;
  city: string;
  latitude: number;
  longitude: number;
  zip: string;
  state: string;
  country: string | null;
  date: Date | null;
  id: string;
  correspondingLocDate: Date | null;
  correspondingLocStr: string;
}

export interface Load {
  id: string;
  delivery: Location;
  mode: string;
  pickup: Location;
  supportStatus: string;
  transitStatus: string;
}

// to plot markers that have overlapping locations
export interface OverlappingLocations {
  pickups: List<Location>;
  deliveries: List<Location>;
}

export interface MapControlState {
  reload: boolean;
  selectedSearchResult: string | null;
  clearFilters: boolean;
  cities: string[];
  weatherToggle: boolean;
  trafficToggle: boolean;
  arcsToggle: boolean;
  timeZoneToggle: boolean;
  locationType: string;
  mode: string;
  states: string[];
  carrierAssigned: string;
  transitStatus: string[];
  deliveryCity: string; // TODO  delete if we don't use this filter
  pickupCity: string; // TODO  delete if we don't use this filter
  address: google.maps.LatLng | null;
  range: number;
  pickupStart: Date | null | undefined;
  pickupEnd: Date | null | undefined;
  deliveryStart: Date | null | undefined;
  deliveryEnd: Date | null | undefined;
}

export type MapReloadAction = { type: "RELOAD"; value: boolean };
export type MapCitiesAction = { type: "CITIES"; value: string[] };
export type MapTrafficAction = { type: "TRAFFIC"; value: boolean };
export type MapWeatherAction = { type: "WEATHER"; value: boolean };
export type MapArcsAction = { type: "ARCS"; value: boolean };
export type MapTimeZoneAction = { type: "TIME_ZONE"; value: boolean };
export type MapLocationTypeAction = { type: "LOCATION_TYPE"; value: string };
export type MapModeAction = { type: "MODES"; value: string};
export type MapStatesAction = { type: "STATES"; value: string[] };
export type MapCarrierAssignedAction = {
  type: "CARRIER_ASSIGNED";
  value: string;
};
export type MapDeliveryCityAction = { type: "DELIVERY_CITY"; value: string }; // TODO  delete if we don't use this filter
export type MapPickupCityAction = { type: "PICKUP_CITY"; value: string }; // TODO  delete if we don't use this filter
export type MapAddressAction = {
  type: "ADDRESS";
  value: google.maps.LatLng | null;
};
export type MapRangeAction = { type: "RANGE"; value: number };
export type MapPickupStartAction = {
  type: "PICKUP_START";
  value: Date | null | undefined;
};
export type MapPickupEndAction = {
  type: "PICKUP_END";
  value: Date | null | undefined;
};
export type MapDeliveryStartAction = {
  type: "DELIVERY_START";
  value: Date | null | undefined;
};
export type MapDeliveryEndAction = {
  type: "DELIVERY_END";
  value: Date | null | undefined;
};
export type MapClearFiltersAction = {
  type: "CLEAR_FILTERS";
  value: boolean;
};

export type MapTransitStatusAction = {
  type: "TRANSIT_STATUS";
  value: string[];
};
export type MapSelectedSearchResultAction = {
  type: "SEARCH_RESULT";
  value: string;
};

export type MapControlAction =
  | MapReloadAction
  | MapCitiesAction
  | MapWeatherAction
  | MapTrafficAction
  | MapArcsAction
  | MapTimeZoneAction
  | MapLocationTypeAction
  | MapModeAction
  | MapStatesAction
  | MapCarrierAssignedAction
  | MapTransitStatusAction
  | MapDeliveryCityAction // TODO  delete if we don't use this filter
  | MapPickupCityAction // TODO  delete if we don't use this filter;
  | MapAddressAction
  | MapRangeAction
  | MapPickupStartAction
  | MapPickupEndAction
  | MapDeliveryStartAction
  | MapDeliveryEndAction
  | MapClearFiltersAction
  | MapSelectedSearchResultAction;
