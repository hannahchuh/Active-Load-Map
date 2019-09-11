import React from "react";

import { Card, Button, Grid } from "semantic-ui-react";
import { OrderedSet } from "immutable";

import AddressRangeFilterCard from "./AddressRangeFilterCard";
import DeliveryDateFilterCardContent from "./DeliveryDateFilterCardContent";
import LoadsFiltersCard from "./LoadsFiltersCard";
import { MapControlAction, MapControlState } from "./types";
import MarkerLegendCard from "./MarkerLegendCard";
import PickupDateFilterCardContent from "./PickupDateFilterCardContent";
import TimeZoneLegendCard from "./TimeZoneLegendCard";
import VisualFiltersCardContent from "./VisualFiltersCardContent";

/*
All filters and map layers are toggled here
*/
export const LoadMapControls: React.FC<{
  displayToast: (
    messageHeader: string,
    messageBody: string,
    status: "SUCCESS" | "ERROR"
  ) => void;
  geocoder: google.maps.Geocoder;
  dispatch: React.Dispatch<MapControlAction>;
  controlState: MapControlState;
  cities: OrderedSet<string>;
  isLoggedIn: boolean;
}> = ({
  displayToast,
  geocoder,
  dispatch,
  controlState,
  cities,
  isLoggedIn
}) => {
  return (
    <div className="map_controls">
      <Card.Group centered>
        <MarkerLegendCard />

        <TimeZoneLegendCard />

        <Card>
          <Card.Content extra textAlign="center">
            <Card.Header>Clear Filters/Refresh Map</Card.Header>
          </Card.Content>
          <Card.Content textAlign="center">
            <Grid columns={1} centered={true}>
              <Grid.Row
                textAlign="center"
                centered={true}
                style={{ paddingBottom: "0" }}
              >
                <Button
                  basic
                  onClick={(e, data) => {
                    dispatch({
                      type: "CLEAR_FILTERS",
                      value: !controlState.clearFilters
                    });
                  }}
                >
                  Clear All Filters
                </Button>
              </Grid.Row>
              <Grid.Row
                textAlign="center"
                centered={true}
                style={{ paddingTop: "5px" }}
              >
                <Button
                  basic
                  disabled={controlState.reload || !isLoggedIn}
                  onClick={(e, data) => {
                    dispatch({ type: "RELOAD", value: !controlState.reload });
                  }}
                >
                  Refresh Map
                </Button>
              </Grid.Row>
            </Grid>
          </Card.Content>
          <Card.Content extra textAlign="center">
            <Card.Header>Visual Filters</Card.Header>
          </Card.Content>
          <Card.Content>
            <VisualFiltersCardContent
              dispatch={dispatch}
              arcsToggle={controlState.arcsToggle}
              weatherToggle={controlState.weatherToggle}
              trafficToggle={controlState.trafficToggle}
              timeZoneToggle={controlState.timeZoneToggle}
            />
          </Card.Content>
        </Card>

        <LoadsFiltersCard
          selectedCities={controlState.cities}
          selectedStates={controlState.states}
          dispatch={dispatch}
          cities={cities}
          mode={controlState.mode}
          transitStatus={controlState.transitStatus}
          carrierAssigned={controlState.carrierAssigned}
          locationType={controlState.locationType}
        />

        <Card>
          <Card.Content extra textAlign="center">
            <Card.Header className = "dateHeader">Pickup Dates</Card.Header>
          </Card.Content>
          <Card.Content>
            <PickupDateFilterCardContent
              dispatch={dispatch}
              pickupStart={controlState.pickupStart}
              pickupEnd={controlState.pickupEnd}
            />
          </Card.Content>

          <Card.Content extra textAlign="center">
            <Card.Header className = "dateHeader">Delivery Dates</Card.Header>
          </Card.Content>
          <Card.Content>
            <DeliveryDateFilterCardContent
              dispatch={dispatch}
              deliveryStart={controlState.deliveryStart}
              deliveryEnd={controlState.deliveryEnd}
            />
          </Card.Content>
        </Card>

        <AddressRangeFilterCard
          displayToast={displayToast}
          geocoder={geocoder}
          dispatch={dispatch}
          range={controlState.range}
          selectedSearchResult={controlState.selectedSearchResult}
        />
      </Card.Group>

      {/* <p> Delivery City </p>
      <input
        value={deliveryCity}
        onChange={e => {
          onDeliveryCityChange(e.target.value);
        }}
      />
      <p> Pickup City </p>
      <input
        value={pickupCity}
        onChange={e => {
          onPickupCityChange(e.target.value);
        }}
      /> */}
    </div>
  );
};

export default LoadMapControls;
