import React from "react";
import { Card, Dropdown, Flag, List } from "semantic-ui-react";
import { OrderedSet } from "immutable";

import { MapControlAction } from "./types";
import {
  modeOptions,
  transitStatusOptions,
  carrierOptions,
  states,
  locationOptions
} from "./util";

/*
Card contains all filter options for modes, cities, transit status, 
carrierAssigned, and pickups/deliveries.
*/
export const LoadsFiltersCard: React.FC<{
  selectedStates: string[];
  selectedCities: string[];
  dispatch: React.Dispatch<MapControlAction>;
  cities: OrderedSet<string>;
  mode: string;
  transitStatus: string[];
  carrierAssigned: string;
  locationType: string;
}> = React.memo(
  ({
    selectedStates,
    selectedCities,
    dispatch,
    cities,
    mode: modes,
    transitStatus,
    carrierAssigned,
    locationType
  }) => {
    return (
      <Card>
        <Card.Content extra textAlign="center">
          <Card.Header>Loads Filters</Card.Header>
        </Card.Content>
        <Card.Content>
          <List>
            <List.Item>
              <Dropdown
                lazyLoad={true}
                placeholder="Mode"
                selection
                clearable
                options={modeOptions}
                value={modes}
                onChange={(e, data) => {
                  dispatch({ type: "MODES", value: data.value as string });
                }}
              />
            </List.Item>

            <List.Item>
              <Dropdown
                lazyLoad={true}
                placeholder="Transit Status"
                multiple
                selection
                clearable
                options={transitStatusOptions}
                value={transitStatus}
                onChange={(_, data) => {
                  if (Array.isArray(data.value)) {
                    dispatch({
                      type: "TRANSIT_STATUS",
                      value: data.value as string[]
                    });
                  }
                }}
              />
            </List.Item>

            <List.Item>
              <Dropdown
                lazyLoad={true}
                placeholder="Carrier"
                selection
                clearable
                options={carrierOptions}
                value={carrierAssigned}
                onChange={(e, data) => {
                  dispatch({
                    type: "CARRIER_ASSIGNED",
                    value: data.value as string
                  });
                }}
              />
            </List.Item>

            <List.Item>
              <Dropdown
                lazyLoad={true}
                placeholder="City"
                multiple
                value = {selectedCities}
                search
                selection
                clearable
                options={cities
                  .toArray()
                  .map(city => ({ value: city, text: city }))}
                onChange={(e, data) => {
                  if (Array.isArray(data.value)) {
                    dispatch({ type: "CITIES", value: data.value as string[] });
                  }
                }}
              />
            </List.Item>

            <List.Item>
              <Dropdown
                lazyLoad={true}
                placeholder="State/Province"
                multiple
                value = {selectedStates}
                search
                selection
                clearable
                options={states.map((state, index) => {
                  if (index < 59) {
                    return { value: state, text: state };
                  } else {
                    return {
                      value: state,
                      text: state,
                      icon: <Flag name="ca" />
                    };
                  }
                })}
                onChange={(e, data) => {
                  if (Array.isArray(data.value)) {
                    dispatch({ type: "STATES", value: data.value as string[] });
                  }
                }}
              />
            </List.Item>

            <List.Item>
              <Dropdown
                lazyLoad={true}
                placeholder="Pickups or Deliveries"
                selection
                clearable
                options={locationOptions}
                value={locationType}
                onChange={(e, data) => {
                  dispatch({
                    type: "LOCATION_TYPE",
                    value: data.value as string
                  });
                }}
              />
            </List.Item>
          </List>
        </Card.Content>
      </Card>
    );
  }
);

export default LoadsFiltersCard;
