import { useState, useEffect } from 'react';
import { setInterval as setWorkerInterval, clearInterval as clearWorkerInterval } from 'worker-timers';

function useWorkerInterval(callback: () => void, delay: number | null) {
  const [intervalId, setIntervalId] = useState<number | null>(null);

  useEffect(() => {
    // If the delay is null, clear the interval and don't start a new one
    if (delay === null) {
      if (intervalId) clearWorkerInterval(intervalId);
      setIntervalId(null);
      return;
    }

    // Set up the interval and keep the interval ID in state
    const id = setWorkerInterval(callback, delay);
    setIntervalId(id);

    // Clear the interval when the component is unmounted or the delay changes
    return () => clearWorkerInterval(id);
  }, [delay, callback]);

  // Provide a way to manually clear the interval if needed
  const clear = () => {
    if (intervalId) {
      clearWorkerInterval(intervalId);
      setIntervalId(null);
    }
  };

  return clear;
}

export default useWorkerInterval;
