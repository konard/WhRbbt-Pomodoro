import { useState } from 'react';
import { useTimer } from './hooks/useTimer';
import { CircularProgress } from './components/CircularProgress';
import { TimerDisplay } from './components/TimerDisplay';
import { Controls } from './components/Controls';
import { ModeSelector } from './components/ModeSelector';
import { SettingsPanel } from './components/SettingsPanel';
import { MODE_LABELS } from './types/timer';

/**
 * Main Pomodoro Timer Application
 *
 * A minimalist Pomodoro timer with:
 * - Focus (25 min), Short Break (5 min), Long Break (15 min) modes
 * - Circular progress indicator
 * - Play/Pause, Reset, and Settings controls
 * - Always on Top toggle
 * - System tray integration (Electron)
 * - Native notifications
 */
function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const timer = useTimer();

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-8">
      {/* Mode indicator */}
      <div className="mb-2">
        <span className="text-dark-muted text-sm uppercase tracking-widest">
          {MODE_LABELS[timer.mode]}
        </span>
      </div>

      {/* Mode selector tabs */}
      <ModeSelector
        currentMode={timer.mode}
        onModeChange={timer.setMode}
        disabled={timer.status === 'running'}
      />

      {/* Circular progress with timer display */}
      <CircularProgress progress={timer.progress} mode={timer.mode}>
        <TimerDisplay timeRemaining={timer.timeRemaining} />
      </CircularProgress>

      {/* Control buttons */}
      <Controls
        status={timer.status}
        mode={timer.mode}
        onPlayPause={timer.togglePlayPause}
        onReset={timer.reset}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

      {/* Status indicator */}
      <div className="mt-6">
        <span className="text-dark-muted text-xs">
          {timer.status === 'running' && 'Running...'}
          {timer.status === 'paused' && 'Paused'}
          {timer.status === 'idle' && timer.timeRemaining === 0 && 'Complete!'}
          {timer.status === 'idle' && timer.timeRemaining > 0 && 'Ready'}
        </span>
      </div>

      {/* Settings panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
