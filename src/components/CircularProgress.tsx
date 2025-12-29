import type { ReactNode } from 'react';
import type { TimerMode } from '../types/timer';

interface CircularProgressProps {
  progress: number; // 0-100
  mode: TimerMode;
  size?: number;
  strokeWidth?: number;
  children?: ReactNode;
}

/**
 * Circular progress bar component
 *
 * Displays a circular progress indicator that fills as the timer progresses.
 * Color changes based on the current timer mode.
 */
export function CircularProgress({
  progress,
  mode,
  size = 280,
  strokeWidth = 8,
  children,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Get the stroke color based on mode
  const getStrokeColor = () => {
    switch (mode) {
      case 'focus':
        return '#ef4444'; // red-500
      case 'shortBreak':
        return '#22c55e'; // green-500
      case 'longBreak':
        return '#3b82f6'; // blue-500
      default:
        return '#ef4444';
    }
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-dark-border"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getStrokeColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300 ease-out"
          style={{
            filter: `drop-shadow(0 0 6px ${getStrokeColor()}40)`,
          }}
        />
      </svg>
      {/* Content inside the circle */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
