import React from "react";

import { Card, Grid, Icon } from "semantic-ui-react";

import moment from "moment";

import TimeZoneClock from "./TimeZoneClock";

/*
Card displays current time in all time zones for LoadMap
*/
export const TimeZoneLegendCard: React.FC<{}> = React.memo(() => {
  return (
    <Card>
      <Card.Content extra textAlign="center">
        <Card.Header>Time Zone Legend</Card.Header>
      </Card.Content>
      <Card.Content>
        <div id="timeZoneLegend">
          <Grid columns={3}>
            <Grid.Row>
              <Grid.Column textAlign="center" width={5}>
                <Icon
                  id="time_zone_zero_circle"
                  name="circle thin"
                  size="large"
                />
              </Grid.Column>
              <Grid.Column textAlign="center" width={3}>
                <h5>{moment().isDST() ? "PDT" : "PST"}</h5>
              </Grid.Column>
              <Grid.Column textAlign="left" width={3}>
                <TimeZoneClock timezone="America/Los_Angeles" />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column textAlign="center" width={5}>
                <Icon
                  id="time_zone_one_circle"
                  name="circle thin"
                  size="large"
                />
              </Grid.Column>
              <Grid.Column textAlign="left" width={3}>
                <h5>{moment().isDST() ? "MDT" : "MST"}</h5>
              </Grid.Column>
              <Grid.Column textAlign="left" width={3}>
                <TimeZoneClock timezone="America/Boise" />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column textAlign="center" width={5}>
                <Icon
                  id="time_zone_two_circle"
                  name="circle thin"
                  size="large"
                />
              </Grid.Column>
              <Grid.Column textAlign="center" width={3}>
                <h5>{moment().isDST() ? "CDT" : "CST"}</h5>
              </Grid.Column>
              <Grid.Column textAlign="left" width={3}>
                <TimeZoneClock timezone="America/Chicago" />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column textAlign="center" width={5}>
                <Icon
                  id="time_zone_three_circle"
                  name="circle thin"
                  size="large"
                />
              </Grid.Column>
              <Grid.Column textAlign="left" width={3}>
                <h5>{moment().isDST() ? "EDT" : "EST"}</h5>
              </Grid.Column>
              <Grid.Column textAlign="left" width={3}>
                <TimeZoneClock timezone="America/New_York" />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column textAlign="center" width={5}>
                <Icon
                  id="time_zone_four_circle"
                  name="circle thin"
                  size="large"
                />
              </Grid.Column>
              <Grid.Column textAlign="left" width={3}>
                <h5>{moment().isDST() ? "ADT" : "AST"}</h5>
              </Grid.Column>
              <Grid.Column textAlign="left" width={3}>
                <TimeZoneClock timezone="America/Halifax" />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column textAlign="center" width={5}>
                <Icon
                  id="time_zone_four_half_circle"
                  name="circle thin"
                  size="large"
                />
              </Grid.Column>
              <Grid.Column textAlign="left" width={3}>
                <h5>{moment().isDST() ? "NDT" : "NST"}</h5>
              </Grid.Column>
              <Grid.Column textAlign="left" width={3}>
                <TimeZoneClock timezone="America/St_Johns" />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </Card.Content>
    </Card>
  );
});

export default TimeZoneLegendCard;
