import type { TimerMode } from '../types/timer';
import { MODE_LABELS, MODE_COLORS } from '../types/timer';

interface ModeSelectorProps {
  currentMode: TimerMode;
  onModeChange: (mode: TimerMode) => void;
  disabled?: boolean;
}

/**
 * Mode selector tabs
 *
 * Allows switching between Focus, Short Break, and Long Break modes.
 */
export function ModeSelector({
  currentMode,
  onModeChange,
  disabled = false,
}: ModeSelectorProps) {
  const modes: TimerMode[] = ['focus', 'shortBreak', 'longBreak'];

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {modes.map((mode) => {
        const isActive = mode === currentMode;
        const colorClass = MODE_COLORS[mode];

        return (
          <button
            key={mode}
            onClick={() => onModeChange(mode)}
            disabled={disabled}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? `${colorClass.bg} text-white shadow-md`
                  : 'bg-dark-card text-dark-muted hover:bg-dark-border hover:text-dark-text border border-dark-border'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {MODE_LABELS[mode]}
          </button>
        );
      })}
    </div>
  );
}
