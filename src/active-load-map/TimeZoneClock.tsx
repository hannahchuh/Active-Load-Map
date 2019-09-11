import React from "react";

import moment from "moment";

import { useInterval } from "./hooks";

/*
Returns current time in specific time zone
*/
export const TimeZoneClock: React.FC<{ timezone: string }> = React.memo(
  ({ timezone }) => {
    // initialize time
    let [momentTime, setMoment] = React.useState<moment.Moment>(
      moment.tz(timezone)
    );

    // update time every 5 seconds
    useInterval(() => {
      setMoment(moment.tz(timezone));
    }, 5000);

    // display time
    if (momentTime) {
      return <h5>{momentTime.format("HH:mm")}</h5>;
    } else {
      return <h5>Null TIme</h5>;
    }
  }
);

export default TimeZoneClock;
