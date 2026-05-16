import { useCallback, useEffect, useRef, useState } from 'react';

interface UseTimerReturn {
  timeRemaining: number;
  isRunning: boolean;
  progress: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export function useTimer(durationSeconds: number = 1500): UseTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(durationSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const progress = ((durationSeconds - timeRemaining) / durationSeconds) * 100;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (timeRemaining <= 0) return;
    setIsRunning(true);
  }, [timeRemaining]);

  const pause = useCallback(() => {
    setIsRunning(false);
    clearTimer();
  }, [clearTimer]);

  const reset = useCallback(() => {
    setIsRunning(false);
    clearTimer();
    setTimeRemaining(durationSeconds);
  }, [durationSeconds, clearTimer]);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearTimer();
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return clearTimer;
  }, [isRunning, clearTimer, timeRemaining]);

  return { timeRemaining, isRunning, progress, start, pause, reset };
}
