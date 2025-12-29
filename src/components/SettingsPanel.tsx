import { useState, useEffect } from 'react';
import { X, Pin, PinOff } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Settings panel overlay
 *
 * Provides settings for the application including Always on Top toggle.
 */
export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);

  // Check initial always-on-top state
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.isAlwaysOnTop().then(setIsAlwaysOnTop);
    }
  }, [isOpen]);

  const handleAlwaysOnTopToggle = async () => {
    if (window.electronAPI) {
      const newState = await window.electronAPI.toggleAlwaysOnTop();
      setIsAlwaysOnTop(newState);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-dark-card border border-dark-border rounded-xl p-6 w-80 shadow-2xl no-drag">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-dark-text">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-dark-border transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5 text-dark-muted" />
          </button>
        </div>

        {/* Settings list */}
        <div className="space-y-4">
          {/* Always on Top toggle */}
          <div className="flex items-center justify-between p-3 bg-dark-bg rounded-lg border border-dark-border">
            <div className="flex items-center gap-3">
              {isAlwaysOnTop ? (
                <Pin className="w-5 h-5 text-blue-500" />
              ) : (
                <PinOff className="w-5 h-5 text-dark-muted" />
              )}
              <div>
                <p className="text-sm font-medium text-dark-text">Always on Top</p>
                <p className="text-xs text-dark-muted">Keep window above others</p>
              </div>
            </div>
            <button
              onClick={handleAlwaysOnTopToggle}
              className={`
                relative w-12 h-6 rounded-full transition-colors duration-200
                ${isAlwaysOnTop ? 'bg-blue-500' : 'bg-dark-border'}
              `}
              role="switch"
              aria-checked={isAlwaysOnTop}
            >
              <span
                className={`
                  absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200
                  ${isAlwaysOnTop ? 'translate-x-6' : 'translate-x-0'}
                `}
              />
            </button>
          </div>

          {/* Info section */}
          <div className="pt-4 border-t border-dark-border">
            <p className="text-xs text-dark-muted text-center">
              Pomodoro Timer v1.0.0
            </p>
            <p className="text-xs text-dark-muted text-center mt-1">
              Focus: 25min | Short Break: 5min | Long Break: 15min
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
