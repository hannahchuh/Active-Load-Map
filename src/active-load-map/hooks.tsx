import React from "react";

// creates a delay for the clocks
export function useInterval(callback: () => void, delay: number) {
  const savedCallback = React.useRef<() => void>(() => {
    return;
  });

  // Remember the latest function.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      if (savedCallback) {
        return savedCallback.current();
      }
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
