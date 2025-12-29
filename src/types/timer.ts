/**
 * Timer mode types
 * - focus: 25 minute work session
 * - shortBreak: 5 minute break
 * - longBreak: 15 minute break
 */
export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

/**
 * Timer status state machine
 * - idle: Timer is stopped and not counting
 * - running: Timer is actively counting down
 * - paused: Timer is paused and can be resumed
 */
export type TimerStatus = 'idle' | 'running' | 'paused';

/**
 * Timer state interface
 */
export interface TimerState {
  mode: TimerMode;
  status: TimerStatus;
  timeRemaining: number; // Time remaining in seconds
  totalTime: number; // Total time for current mode in seconds
}

/**
 * Timer configuration for each mode (in seconds)
 */
export const TIMER_DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60,      // 25 minutes
  shortBreak: 5 * 60,  // 5 minutes
  longBreak: 15 * 60,  // 15 minutes
};

/**
 * Mode display names
 */
export const MODE_LABELS: Record<TimerMode, string> = {
  focus: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

/**
 * Mode colors (Tailwind classes)
 */
export const MODE_COLORS: Record<TimerMode, { primary: string; bg: string }> = {
  focus: {
    primary: 'text-red-500',
    bg: 'bg-red-500',
  },
  shortBreak: {
    primary: 'text-green-500',
    bg: 'bg-green-500',
  },
  longBreak: {
    primary: 'text-blue-500',
    bg: 'bg-blue-500',
  },
};
