import { useState, useCallback, useEffect, useRef } from 'react';
import type { TimerMode, TimerState } from '../types/timer';
import { TIMER_DURATIONS } from '../types/timer';

/**
 * Custom hook for managing the Pomodoro timer
 *
 * Uses a Web Worker for accurate timing that doesn't drift
 * when the window is in the background.
 */
export function useTimer() {
  const [state, setState] = useState<TimerState>({
    mode: 'focus',
    status: 'idle',
    timeRemaining: TIMER_DURATIONS.focus,
    totalTime: TIMER_DURATIONS.focus,
  });

  const workerRef = useRef<Worker | null>(null);

  // Initialize Web Worker
  useEffect(() => {
    // Create the worker
    workerRef.current = new Worker(
      new URL('../workers/timer.worker.ts', import.meta.url),
      { type: 'module' }
    );

    // Handle messages from worker
    workerRef.current.onmessage = (event: MessageEvent) => {
      const { type } = event.data;

      if (type === 'tick') {
        setState((prev) => ({
          ...prev,
          timeRemaining: event.data.timeRemaining,
        }));
      } else if (type === 'complete') {
        // Timer completed
        setState((prev) => ({
          ...prev,
          status: 'idle',
          timeRemaining: 0,
        }));

        // Show notification
        if (window.electronAPI) {
          const notificationTitle = 'Pomodoro Timer';
          const notificationBody =
            state.mode === 'focus'
              ? 'Focus session complete! Time for a break.'
              : 'Break is over! Ready to focus?';
          window.electronAPI.showNotification(notificationTitle, notificationBody);
        }
      }
    };

    // Cleanup on unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.postMessage({ type: 'stop' });
        workerRef.current.terminate();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update notification message when mode changes
  useEffect(() => {
    // This effect ensures we have the latest mode for notifications
  }, [state.mode]);

  /**
   * Start or resume the timer
   */
  const start = useCallback(() => {
    if (state.status === 'running') return;

    setState((prev) => ({ ...prev, status: 'running' }));

    if (state.status === 'paused') {
      // Resume from paused state
      workerRef.current?.postMessage({ type: 'resume' });
    } else {
      // Start fresh
      workerRef.current?.postMessage({
        type: 'start',
        duration: state.timeRemaining,
      });
    }
  }, [state.status, state.timeRemaining]);

  /**
   * Pause the timer
   */
  const pause = useCallback(() => {
    if (state.status !== 'running') return;

    setState((prev) => ({ ...prev, status: 'paused' }));
    workerRef.current?.postMessage({ type: 'pause' });
  }, [state.status]);

  /**
   * Toggle between play and pause
   */
  const togglePlayPause = useCallback(() => {
    if (state.status === 'running') {
      pause();
    } else {
      start();
    }
  }, [state.status, start, pause]);

  /**
   * Reset the timer to initial state for current mode
   */
  const reset = useCallback(() => {
    workerRef.current?.postMessage({ type: 'stop' });

    setState((prev) => ({
      ...prev,
      status: 'idle',
      timeRemaining: prev.totalTime,
    }));
  }, []);

  /**
   * Change the timer mode
   */
  const setMode = useCallback((newMode: TimerMode) => {
    workerRef.current?.postMessage({ type: 'stop' });

    const newTotalTime = TIMER_DURATIONS[newMode];
    setState({
      mode: newMode,
      status: 'idle',
      timeRemaining: newTotalTime,
      totalTime: newTotalTime,
    });
  }, []);

  /**
   * Calculate progress percentage (0-100)
   */
  const progress = state.totalTime > 0
    ? ((state.totalTime - state.timeRemaining) / state.totalTime) * 100
    : 0;

  return {
    ...state,
    progress,
    start,
    pause,
    togglePlayPause,
    reset,
    setMode,
  };
}

export type UseTimerReturn = ReturnType<typeof useTimer>;
