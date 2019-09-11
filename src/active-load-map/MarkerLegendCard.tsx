import React from "react";

import { Card, Grid } from "semantic-ui-react";

/*
Card with legend displaying three types of delivery markers/one pickup markers
*/
export const MarkerLegendCard: React.FC<{}> = React.memo(() => {
  return (
    <Card>
      <Card.Content extra textAlign="center">
        <Card.Header>Marker Legend</Card.Header>
      </Card.Content>

      <Card.Content textAlign="center">
        <div id="markerLegend">
          <Grid columns={2}>
            <Grid.Row>
              <Grid.Column width={3} textAlign="center">
                <img
                  src="https://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
                  alt=""
                />
              </Grid.Column>
              <Grid.Column width={10} textAlign="left">
                <h5>Delivery (Transit Status: At Delivery)</h5>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={3} textAlign="center">
                <img
                  src="https://maps.google.com/mapfiles/ms/icons/orange-dot.png"
                  alt=""
                />
              </Grid.Column>

              <Grid.Column width={10} textAlign="left">
                <h5>Delivery (Transit Status: Travelling)</h5>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={3} textAlign="center">
                <img
                  src="https://maps.google.com/mapfiles/ms/icons/red-dot.png"
                  alt=""
                />
              </Grid.Column>
              <Grid.Column width={10} textAlign="left">
                <h5>Delivery (All Other Transit Statuses)</h5>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={3} textAlign="center">
                <img
                  src="https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                  alt=""
                />
              </Grid.Column>

              <Grid.Column width={10} textAlign="left">
                <h5>Pickup</h5>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </Card.Content>
    </Card>
  );
});

export default MarkerLegendCard;
