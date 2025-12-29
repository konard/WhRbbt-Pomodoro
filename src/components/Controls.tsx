import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import type { TimerStatus, TimerMode } from '../types/timer';
import { MODE_COLORS } from '../types/timer';

interface ControlsProps {
  status: TimerStatus;
  mode: TimerMode;
  onPlayPause: () => void;
  onReset: () => void;
  onSettingsClick: () => void;
}

/**
 * Timer control buttons
 *
 * Provides Play/Pause, Reset, and Settings buttons for timer control.
 */
export function Controls({
  status,
  mode,
  onPlayPause,
  onReset,
  onSettingsClick,
}: ControlsProps) {
  const isRunning = status === 'running';
  const colorClass = MODE_COLORS[mode];

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      {/* Reset button */}
      <button
        onClick={onReset}
        className="p-3 rounded-full bg-dark-card hover:bg-dark-border transition-colors border border-dark-border"
        aria-label="Reset timer"
        title="Reset"
      >
        <RotateCcw className="w-5 h-5 text-dark-muted" />
      </button>

      {/* Play/Pause button - larger and prominent */}
      <button
        onClick={onPlayPause}
        className={`p-4 rounded-full transition-all duration-200 ${colorClass.bg} hover:opacity-90 shadow-lg`}
        aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        title={isRunning ? 'Pause' : 'Start'}
      >
        {isRunning ? (
          <Pause className="w-8 h-8 text-white" fill="white" />
        ) : (
          <Play className="w-8 h-8 text-white" fill="white" />
        )}
      </button>

      {/* Settings button */}
      <button
        onClick={onSettingsClick}
        className="p-3 rounded-full bg-dark-card hover:bg-dark-border transition-colors border border-dark-border"
        aria-label="Settings"
        title="Settings"
      >
        <Settings className="w-5 h-5 text-dark-muted" />
      </button>
    </div>
  );
}
