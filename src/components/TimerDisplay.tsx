interface TimerDisplayProps {
  timeRemaining: number; // Time in seconds
}

/**
 * Timer display component
 *
 * Formats and displays the remaining time in MM:SS format.
 */
export function TimerDisplay({ timeRemaining }: TimerDisplayProps) {
  // Format time as MM:SS
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  return (
    <div className="text-center">
      <span
        className="text-6xl font-light tracking-wider text-dark-text tabular-nums"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {formattedTime}
      </span>
    </div>
  );
}
