import React from "react";

import { Card } from "semantic-ui-react";

import { MapControlAction } from "./types";
import MapSearch from "./MapSearch";

/*
card containing: slider to set the range and a search box with autocomplete 
for location to search a radius around
*/
export const AddressRangeFilterCard: React.FC<{
  displayToast: (
    messageHeader: string,
    messageBody: string,
    status: "SUCCESS" | "ERROR"
  ) => void;
  geocoder: google.maps.Geocoder;
  dispatch: React.Dispatch<MapControlAction>;
  range: number;
  selectedSearchResult: string | null;
}> = React.memo(
  ({ displayToast, geocoder, dispatch, range, selectedSearchResult }) => {
    const onAutocompleteSelect = React.useCallback(
      coord => {
        dispatch({ type: "ADDRESS", value: coord });
      },
      [dispatch]
    );
    return (
      <Card>
        <Card.Content extra textAlign="center">
          <Card.Header>Address Range Search</Card.Header>
        </Card.Content>

        <Card.Content textAlign="center">
          <span id="range_search_lower_limit">0</span>
          <input
            type="range"
            min="0"
            max="300"
            step="10"
            value={range}
            onChange={e => {
              dispatch({ type: "RANGE", value: Number(e.target.value) });
            }}
          />
          <span id="range_search_upper_limit">300</span>
          <span className="radius_label">
            <h5>Current Radius: {range} miles</h5>
          </span>
          <div className="map_search">
            <MapSearch
              selectedSearchResult={selectedSearchResult}
              dispatch={dispatch}
              displayToast={displayToast}
              geocoder={geocoder}
              onSelect={onAutocompleteSelect}
            />
          </div>
        </Card.Content>
      </Card>
    );
  }
);

export default AddressRangeFilterCard;
