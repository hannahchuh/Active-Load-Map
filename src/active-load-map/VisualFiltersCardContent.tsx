import React from "react";

import { Card, Button, Grid } from "semantic-ui-react";

import { MapControlAction } from "./types";

/*
Card with toggles for traffic, transit arcs, weather, and time zone overlays
*/
export const VisualFiltersCardContent: React.FC<{
  dispatch: React.Dispatch<MapControlAction>;
  trafficToggle: boolean;
  arcsToggle: boolean;
  weatherToggle: boolean;
  timeZoneToggle: boolean;
}> = React.memo(
  ({ dispatch, trafficToggle, arcsToggle, weatherToggle, timeZoneToggle }) => {
    return (
      <div>
        <Card.Content textAlign="center">
          <Grid columns={2} centered={true}>
            <Grid.Row
              textAlign="center"
              centered={true}
              style={{ paddingBottom: "0" }}
            >
              <div>
                <Button
                  basic
                  toggle
                  active={trafficToggle}
                  onClick={(e, data) => {
                    dispatch({
                      type: "TRAFFIC",
                      value: !data.active as boolean
                    });
                  }}
                >
                  Traffic
                </Button>
                <Button
                  basic
                  toggle
                  active={arcsToggle}
                  onClick={(e, data) => {
                    dispatch({
                      type: "ARCS",
                      value: !data.active as boolean
                    });
                  }}
                >
                  Transit Arcs
                </Button>
              </div>
            </Grid.Row>
            <Grid.Row
              textAlign="center"
              centered={true}
              style={{ paddingTop: "5px" }}
            >
              <div>
                <Button
                  basic
                  toggle
                  active={weatherToggle}
                  onClick={(e, data) => {
                    dispatch({
                      type: "WEATHER",
                      value: !data.active as boolean
                    });
                  }}
                >
                  Weather
                </Button>
                <Button
                  basic
                  toggle
                  active={timeZoneToggle}
                  onClick={(e, data) => {
                    dispatch({
                      type: "TIME_ZONE",
                      value: !data.active as boolean
                    });
                  }}
                >
                  Time Zone
                </Button>
              </div>
            </Grid.Row>
          </Grid>
        </Card.Content>
      </div>
    );
  }
);

export default VisualFiltersCardContent;
