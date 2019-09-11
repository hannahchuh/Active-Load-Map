import React from "react";

import {
  newAutocompleteService,
  getQueryPredictions,
  geocode,
  newLatLng
} from "../google-maps";
import { Search } from "semantic-ui-react";

import { MapControlAction } from "./types";

/*
Autocomplete/search bar for locations
*/
export const MapSearch: React.FC<{
  displayToast: (
    messageHeader: string,
    messageBody: string,
    status: "SUCCESS" | "ERROR"
  ) => void;
  geocoder: google.maps.Geocoder;
  dispatch: React.Dispatch<MapControlAction>;
  selectedSearchResult: string | null;
  onSelect: (coord: google.maps.LatLng | null) => void;
}> = React.memo(
  ({ displayToast, geocoder, dispatch, selectedSearchResult, onSelect }) => {
    const autocompleteRef = React.useRef(newAutocompleteService());
    const [searchInput, setSearchInput] = React.useState("");
    const [searchResults, setSearchResults] = React.useState<
      { title: string; id: string }[]
    >([]);

    const junkDivRef = React.useRef<HTMLDivElement>(null);

    // autocomplete for address search
    React.useEffect(() => {
      dispatch({ type: "SEARCH_RESULT", value: "" });
      let cancelEffect = false;

      const bounds = {
        east: -59.699715,
        north: 47.188661,
        south: 23.195281,
        west: -123.905643
      };
      const options = { input: searchInput, types: ["cities"], bounds };
      const timeout = setTimeout(async () => {
        if (searchInput === "") {
          if (!cancelEffect) {
            onSelect(null);
          }
          return;
        }

        try {
          const predictions = await getQueryPredictions(
            autocompleteRef.current,
            options
          );

          const formattedResults = predictions.map(
            ({ place_id, description }) => ({
              title: description,
              id: place_id
            })
          );

          if (!cancelEffect) {
            setSearchResults(formattedResults);
          }
        } catch (err) {
          console.error(err);
          if (!cancelEffect) {
            
            displayToast("Error connecting to Google Maps", err.error, "ERROR");
          }
        }
      }, 300);

      return () => {
        cancelEffect = true;
        clearTimeout(timeout);
      };
    }, [displayToast, onSelect, dispatch, searchInput]);

    // get google geocoder result's lat and long
    const onResultSelect = async (_: any, { result: { id, title } }: any) => {
      try {
        dispatch({ type: "SEARCH_RESULT", value: title });
        const result = await geocode(geocoder, { placeId: id });
        const { latitude, longitude } = result[0];
        const latLng = newLatLng(latitude, longitude);
        onSelect(latLng);
      } catch (err) {
        displayToast("Error connecting to Google Maps", err.error, "ERROR");
        console.error(err);
      }
    };

    return (
      <div className="SearchContainer">
        <Search
          value={
            selectedSearchResult === null
              ? ""
              : selectedSearchResult === ""
              ? searchInput
              : selectedSearchResult
          }
          selectFirstResult={true}
          results={searchResults}
          onSearchChange={(e: any) => {
            setSearchInput(e.target.value);
          }}
          onResultSelect={onResultSelect}
        />
        <div className="JunkDiv" ref={junkDivRef} />
      </div>
    );
  }
);

export default MapSearch;
