import React from "react";

import DatePicker from "react-datepicker";

import { Card, Grid, Button, Icon, Input } from "semantic-ui-react";

import { MapControlAction } from "./types";

/*
Card has two date pickers to set either/both dates for delivery start and end
*/
export const DeliveryDateFilterCardContent: React.FC<{
  dispatch: React.Dispatch<MapControlAction>;
  deliveryStart: Date | undefined | null;
  deliveryEnd: Date | undefined | null;
}> = React.memo(({ dispatch, deliveryStart, deliveryEnd }) => {
  return (
    
      <Card.Content>
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
                        {(deliveryStart && deliveryStart.toDateString()) ||
                          "Select date"}
                      </Button>
                      <Button
                        icon
                        onClick={() => {
                          dispatch({ type: "DELIVERY_START", value: null });
                        }}
                      >
                        <Icon name="cancel" />
                      </Button>
                    </Button.Group>
                  </div>
                }
                selected={deliveryStart ? deliveryStart : null}
                selectsStart
                startDate={deliveryStart}
                endDate={deliveryEnd}
                onChange={e => {
                  dispatch({ type: "DELIVERY_START", value: e });
                }}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column textAlign="center" width={3}>
              <h5>To:</h5>
            </Grid.Column>
            <Grid.Column>
              <Input
                input={
                  <DatePicker
                    customInput={
                      <div>
                        <Button.Group>
                          <Button fluid>
                            {(deliveryEnd && deliveryEnd.toDateString()) ||
                              "Select date"}
                          </Button>
                          <Button
                            icon
                            onClick={() => {
                              dispatch({
                                type: "DELIVERY_END",
                                value: null
                              });
                            }}
                          >
                            <Icon name="cancel" />
                          </Button>
                        </Button.Group>
                      </div>
                    }
                    selected={deliveryEnd ? deliveryEnd : null}
                    selectsEnd
                    startDate={deliveryStart}
                    endDate={deliveryEnd}
                    onChange={e => {
                      dispatch({ type: "DELIVERY_END", value: e });
                    }}
                    minDate={deliveryStart}
                  />
                }
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card.Content>
  );
});

export default DeliveryDateFilterCardContent;
