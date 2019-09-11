import React from "react";

import { Card, Grid, Button, Icon } from "semantic-ui-react";
import DatePicker from "react-datepicker";

import { MapControlAction } from "./types";

/*
Card has two date pickers to select either/both of start/end of pickup date
*/
export const PickupDateFilterCardContent: React.FC<{
  dispatch: React.Dispatch<MapControlAction>;
  pickupStart: Date | null | undefined;
  pickupEnd: Date | null | undefined;
}> = React.memo(({ dispatch, pickupStart, pickupEnd }) => {
  return (
      <Card.Content textAlign="center">
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column textAlign="center" width={3}>
              <h5>From:</h5>
            </Grid.Column>

            <Grid.Column>
              <DatePicker
                customInput={
                  <div>
                    <Button.Group>
                      <Button fluid>
                        {(pickupStart && pickupStart.toDateString()) ||
                          "Select date"}
                      </Button>
                      <Button
                        icon
                        onClick={() => {
                          dispatch({ type: "PICKUP_START", value: null });
                        }}
                      >
                        <Icon name="cancel" />
                      </Button>
                    </Button.Group>
                  </div>
                }
                selected={pickupStart ? pickupStart : null}
                selectsStart
                startDate={pickupStart}
                endDate={pickupEnd}
                onChange={e => {
                  dispatch({ type: "PICKUP_START", value: e });
                }}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column textAlign="center" width={3}>
              <h5>To:</h5>
            </Grid.Column>

            <Grid.Column>
              <DatePicker
                customInput={
                  <div>
                    <Button.Group>
                      <Button fluid>
                        {(pickupEnd && pickupEnd.toDateString()) ||
                          "Select date"}
                      </Button>
                      <Button
                        icon
                        onClick={() => {
                          dispatch({ type: "PICKUP_END", value: null });
                        }}
                      >
                        <Icon name="cancel" />
                      </Button>
                    </Button.Group>
                  </div>
                }
                selected={pickupEnd ? pickupEnd : null}
                selectsEnd
                startDate={pickupStart}
                endDate={pickupEnd}
                onChange={e => {
                  dispatch({ type: "PICKUP_END", value: e });
                }}
                minDate={pickupStart}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card.Content>
  );
});

export default PickupDateFilterCardContent;
