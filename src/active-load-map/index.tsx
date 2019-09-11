import React from "react";

import { List, OrderedSet } from "immutable";
import moment from "moment";
import "moment-timezone";

import "./index.css";
import "react-datepicker/dist/react-datepicker.css";

import Toast from "../toast/Toast";
// import { getIdToken } from "../login/loginApi";

import {
  filterByDate,
  filterByCarrierAssigned,
  filterByCities,
  filterByModes,
  filterByTransitStatus,
  filterByStates,
  filterByRange
} from "./filters";
import {
  Load,
  Location,
  MapControlState,
  MapControlAction,
  UnformmatedLoad
} from "./types";
import LoadMap from "./LoadMap";
import LoadMapControls from "./LoadMapControls";
import sampleUnformmatedLoads from "./sampleData";

const initialMapArgs: MapControlState = {
  reload: true,
  selectedSearchResult: null,
  clearFilters: false,
  cities: [],
  mode: "",
  states: [],
  transitStatus: [],
  weatherToggle: false,
  trafficToggle: false,
  arcsToggle: false,
  timeZoneToggle: false,
  locationType: "",
  carrierAssigned: "",
  deliveryCity: "", // TODO  delete if we don't use this filter
  pickupCity: "", // TODO  delete if we don't use this filter
  address: null,
  range: 50,
  pickupStart: null,
  pickupEnd: null,
  deliveryStart: null,
  deliveryEnd: null
};

// used to change map control filters in child component MapControls
function mapArgsReducer(
  oldState: MapControlState,
  action: MapControlAction
): MapControlState {
  switch (action.type) {
    case "RELOAD":
      return { ...oldState, reload: action.value };
    case "CITIES":
      return { ...oldState, cities: action.value };
    case "WEATHER":
      return { ...oldState, weatherToggle: action.value };
    case "TRAFFIC":
      return { ...oldState, trafficToggle: action.value };
    case "ARCS":
      return { ...oldState, arcsToggle: action.value };
    case "TIME_ZONE":
      return { ...oldState, timeZoneToggle: action.value };
    case "LOCATION_TYPE":
      return { ...oldState, locationType: action.value };
    case "MODES":
      return { ...oldState, mode: action.value };
    case "STATES":
      return { ...oldState, states: action.value };
    case "CARRIER_ASSIGNED":
      return { ...oldState, carrierAssigned: action.value };
    case "DELIVERY_CITY": // TODO  delete if we don't use this filter
      return { ...oldState, deliveryCity: action.value };
    case "PICKUP_CITY":
      return { ...oldState, pickupCity: action.value };
    case "ADDRESS":
      return { ...oldState, address: action.value };
    case "RANGE":
      return { ...oldState, range: action.value };
    case "PICKUP_START":
      return { ...oldState, pickupStart: action.value };
    case "PICKUP_END":
      return { ...oldState, pickupEnd: action.value };
    case "DELIVERY_START":
      return { ...oldState, deliveryStart: action.value };
    case "DELIVERY_END":
      return { ...oldState, deliveryEnd: action.value };
    case "CLEAR_FILTERS":
      return { ...initialMapArgs, reload: false };
    case "SEARCH_RESULT":
      return { ...oldState, selectedSearchResult: action.value };
    case "TRANSIT_STATUS":
      return { ...oldState, transitStatus: action.value };
    default:
      return oldState;
  }
}

function toastReducer(
  state: {
    messageBody?: string | null;
    messageHeader?: string | null;
    status?: "SUCCESS" | "ERROR" | null;
  },
  action:
    | {
        type: "SHOW";
        status: "SUCCESS" | "ERROR";
        messageBody: string;
        messageHeader: string;
      }
    | {
        type: "HIDE";
      }
): {
  messageBody?: string | null;
  messageHeader?: string | null;
  status?: "SUCCESS" | "ERROR" | null;
} {
  switch (action.type) {
    case "SHOW":
      return {
        ...state,
        messageBody: action.messageBody,
        messageHeader: action.messageHeader,
        status: action.status
      };
    case "HIDE":
      return {
        ...state,
        messageBody: null,
        messageHeader: null,
        status: null
      };
    default:
      return state;
  }
}

const ActiveLoadMapApp: React.FC<{ isLoggedIn: boolean }> = React.memo(
  ({ isLoggedIn }) => {
    const [loads, setLoads] = React.useState<List<Load>>(List());
    const [cities, setCities] = React.useState<OrderedSet<string>>(
      OrderedSet()
    );
    const geocoderRef = React.useRef<google.maps.Geocoder>(
      new window.google.maps.Geocoder()
    );

    const [
      { messageBody, messageHeader, status },
      toastDispatch
    ] = React.useReducer(toastReducer, {});

    const displayToast = React.useCallback(
      (
        messageHeader: string,
        messageBody: string,
        status: "SUCCESS" | "ERROR"
      ) => {
        toastDispatch({
          messageBody,
          messageHeader,
          status: status,
          type: "SHOW"
        });
      },
      [toastDispatch]
    );

    const clearMessage = React.useCallback(() => {
      toastDispatch({ type: "HIDE" });
    }, [toastDispatch]);

    const [mapControlState, dispatch] = React.useReducer(
      mapArgsReducer,
      initialMapArgs
    );

    // read and parse loads
    React.useEffect(() => {
      let cancelEffect = false;

      const runFetchPickupsAndDeliveries = async () => {
        if (
          /* !isLoggedIn || */ // include for login functionality
          !mapControlState.reload
        ) {
          return;
        }

        // fetch load data
        /* const apiUrl = process.env.REACT_APP_DB_LINK; */

        if (!cancelEffect) {
          dispatch({
            type: "RELOAD",
            value: true
          });
        }

        /*
        try {
          const token = await getIdToken();
          const res = await fetch(
            `${apiUrl}/api/load/query-active-loads?token=${token}`
          );
          const queryData: {
            activeLoads: UnformmatedLoad[];
          } = await res.json();

          //filter out loads with null coords
          const unformattedLoads = queryData.activeLoads.filter(load => {
            return (
              load.pickupLatitude !== null &&
              load.pickupLongitude !== null &&
              load.deliveryLongitude !== null &&
              load.deliveryLatitude !== null
            );
          });
        */

        const unformattedLoads: UnformmatedLoad[] = sampleUnformmatedLoads;
        // format loads for active load map
        const formattedLoads = parseUnformattedLoads(unformattedLoads);

        // create list of cities from pickups/deliveries (for use in cities filter)
        const citiesSet = parseLoadsCities(formattedLoads);

        if (!cancelEffect) {
          await setLoads(formattedLoads);
          await setCities(citiesSet);

          dispatch({
            type: "RELOAD",
            value: false
          });
        }
        /*
      } 
      */
        /*
        catch (err) {
          console.error(err);
          if (!cancelEffect) {
            dispatch({
              type: "RELOAD",
              value: false
            });
            displayToast(
              "Error retrieving loads from database",
              err.error,
              "ERROR"
            );
          }
        }
        */
      };

      runFetchPickupsAndDeliveries();

      return () => {
        cancelEffect = true;
      };
    }, [
      displayToast /*isLoggedIn,*/, // include for login functionality
      mapControlState.reload
    ]);

    /*     // include for login functionality (will cause the loads to loadF)
    React.useEffect(() => {
      if (isLoggedIn) {
        dispatch({
          type: "RELOAD",
          value: true
        });
      }

      if (!isLoggedIn) {
        setLoads(List());
      }
    }, [isLoggedIn]);
    */

    // pickup and delivery date filter
    const pickupDateFilter = React.useCallback(
      filterByDate(
        mapControlState.pickupStart,
        mapControlState.pickupEnd,
        "pickup"
      ),
      [mapControlState.pickupStart, mapControlState.pickupEnd]
    );
    const deliveryDateFilter = React.useCallback(
      filterByDate(
        mapControlState.deliveryStart,
        mapControlState.deliveryEnd,
        "delivery"
      ),
      [mapControlState.deliveryStart, mapControlState.deliveryEnd]
    );

    // carrierAssigned filter
    const carrierAssignedFilter = React.useCallback(
      filterByCarrierAssigned(mapControlState.carrierAssigned),
      [mapControlState.carrierAssigned]
    );

    // cities filter (multi-city select)
    const citiesFilter = React.useCallback(
      filterByCities(mapControlState.locationType, mapControlState.cities),
      [mapControlState.locationType, mapControlState.cities]
    );

    // modes filter
    const modesFilter = React.useCallback(filterByModes(mapControlState.mode), [
      mapControlState.mode
    ]);

    const transitStatusFilter = React.useCallback(
      filterByTransitStatus(mapControlState.transitStatus),
      [mapControlState.transitStatus]
    );

    // states filter
    const statesFilter = React.useCallback(
      filterByStates(mapControlState.locationType, mapControlState.states),
      [mapControlState.locationType, mapControlState.states]
    );

    // address autocomplete
    const rangeFilter = React.useCallback(
      filterByRange(
        mapControlState.locationType,
        mapControlState.range,
        mapControlState.address
      ),
      [
        mapControlState.locationType,
        mapControlState.range,
        mapControlState.address
      ]
    );

    // apply all filters to loads
    const filteredLoads = React.useMemo(() => {
      return loads
        .filter(modesFilter)
        .filter(citiesFilter)
        .filter(carrierAssignedFilter)
        .filter(rangeFilter)
        .filter(statesFilter)
        .filter(pickupDateFilter)
        .filter(transitStatusFilter)
        .filter(deliveryDateFilter);
    }, [
      loads,
      modesFilter,
      carrierAssignedFilter,
      citiesFilter,
      rangeFilter,
      statesFilter,
      pickupDateFilter,
      deliveryDateFilter,
      transitStatusFilter
    ]);

    // delivery city filter -- TODO can probably delete
    // const deliveryCityFilter = React.useCallback(
    //   filterByCity(mapControlState.deliveryCity),
    //   [mapControlState.deliveryCity]
    // );

    // // pickup city filter -- TODO can probably delete
    // const pickupCityFilter = React.useCallback(
    //   filterByCity(mapControlState.pickupCity),
    //   [mapControlState.pickupCity]
    // );

    return (
      <div className="loadMapContainer">
        <LoadMap
          loading={isLoggedIn && mapControlState.reload}
          loads={filteredLoads}
          trafficToggle={mapControlState.trafficToggle}
          weatherToggle={mapControlState.weatherToggle}
          timeZoneToggle={mapControlState.timeZoneToggle}
          arcsToggle={mapControlState.arcsToggle}
          locationType={mapControlState.locationType}
        />

        <LoadMapControls
          displayToast={displayToast}
          dispatch={dispatch}
          controlState={mapControlState}
          geocoder={geocoderRef.current}
          cities={cities}
          isLoggedIn={isLoggedIn}
        />

        <Toast
          messageBody={messageBody}
          messageHeader={messageHeader}
          messageStatus={status}
          onClose={clearMessage}
        />
      </div>
    );
  }
);

// create a date object that is at midnight in the browser's time zone
function toLocalDate(dateStr: string): Date {
  const dateMoment = moment(dateStr.substring(0, 10));
  const dateNoOffset = new Date(dateMoment.toString());
  return dateNoOffset;
}

// takes loads and returns an OrderedSet of all cities the loads' pickups/deliveries are at
function parseLoadsCities(
  locations: List<{ pickup: Location; delivery: Location }>
): OrderedSet<string> {
  const pickupCities = locations.map(location => location.pickup.city);
  const deliveryCities = locations.map(location => location.delivery.city);
  return OrderedSet(pickupCities.concat(deliveryCities));
}

// parse loads from api request for use in active load map
function parseUnformattedLoads(loads: UnformmatedLoad[]): List<Load> {
  const formattedLoads = List(
    loads.map(load => {
      // set pickup and delivery date to null or convert the string to Date
      let pickupDate: Date | null;
      let deliveryDate: Date | null;
      if (load.pickupDate === null) {
        pickupDate = null;
      } else {
        // const date = new Date(load.pickupDate);
        const date = toLocalDate(load.pickupDate);
        pickupDate = date;
      }

      if (load.deliveryDate === null) {
        deliveryDate = null;
      } else {
        const date = toLocalDate(load.deliveryDate);
        deliveryDate = date;
      }

      const deliveryLat = load.deliveryLatitude as number;
      const deliveryLong = load.deliveryLongitude as number;
      const pickupLat = load.pickupLatitude as number;
      const pickupLong = load.pickupLongitude as number;

      return {
        id: load.id,
        mode: load.mode,
        supportStatus: load.supportStatus,
        transitStatus: load.transitStatus,

        delivery: {
          locationType: "delivery",
          id: load.id,
          latitude: deliveryLat,
          longitude: deliveryLong,
          city: load.deliveryCity,
          zip: load.deliveryZip,
          state: load.deliveryState,
          country: load.deliveryCountry,
          carrierName: load.carrierName,
          carrierContact: load.carrierContact,
          driverContact: load.driverContact,
          equipment: load.equipment,
          date: deliveryDate,
          transitStatus: load.transitStatus,
          correspondingLocDate: pickupDate,
          correspondingLocStr: load.pickupCity + ", " + load.pickupState
        },
        pickup: {
          locationType: "pickup",
          id: load.id,
          latitude: pickupLat,
          longitude: pickupLong,
          city: load.pickupCity,
          zip: load.pickupZip,
          state: load.pickupState,
          country: load.pickupCountry,
          carrierName: load.carrierName,
          carrierContact: load.carrierContact,
          driverContact: load.driverContact,
          equipment: load.equipment,
          date: pickupDate,
          transitStatus: load.transitStatus,
          correspondingLocDate: deliveryDate,
          correspondingLocStr: load.deliveryCity + ", " + load.deliveryState
        }
      };
    })
  );
  return formattedLoads;
}

export default ActiveLoadMapApp;
