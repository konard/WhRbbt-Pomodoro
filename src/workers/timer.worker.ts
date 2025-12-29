/**
 * Timer Web Worker
 *
 * This worker handles the timer countdown to ensure accurate timing
 * even when the main window is in the background or minimized.
 *
 * Web Workers run in a separate thread and are not affected by
 * browser throttling of background tabs.
 */

let intervalId: ReturnType<typeof setInterval> | null = null;
let targetEndTime: number | null = null;
let isPaused = false;
let pausedTimeRemaining: number | null = null;

// Message types
interface StartMessage {
  type: 'start';
  duration: number; // Duration in seconds
}

interface StopMessage {
  type: 'stop';
}

interface PauseMessage {
  type: 'pause';
}

interface ResumeMessage {
  type: 'resume';
}

type WorkerMessage = StartMessage | StopMessage | PauseMessage | ResumeMessage;

// Response types
interface TickResponse {
  type: 'tick';
  timeRemaining: number;
}

interface CompleteResponse {
  type: 'complete';
}

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { type } = event.data;

  switch (type) {
    case 'start': {
      const { duration } = event.data as StartMessage;
      startTimer(duration);
      break;
    }
    case 'stop': {
      stopTimer();
      break;
    }
    case 'pause': {
      pauseTimer();
      break;
    }
    case 'resume': {
      resumeTimer();
      break;
    }
  }
};

function startTimer(duration: number): void {
  // Clear any existing interval
  stopTimer();

  isPaused = false;
  pausedTimeRemaining = null;
  targetEndTime = Date.now() + duration * 1000;

  // Use setInterval with a short interval for smooth updates
  intervalId = setInterval(() => {
    if (isPaused || !targetEndTime) return;

    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((targetEndTime - now) / 1000));

    // Send tick update
    const tickResponse: TickResponse = {
      type: 'tick',
      timeRemaining: remaining,
    };
    self.postMessage(tickResponse);

    // Check if timer completed
    if (remaining <= 0) {
      const completeResponse: CompleteResponse = {
        type: 'complete',
      };
      self.postMessage(completeResponse);
      stopTimer();
    }
  }, 100); // Check every 100ms for smooth updates

  // Send initial tick
  const initialTick: TickResponse = {
    type: 'tick',
    timeRemaining: duration,
  };
  self.postMessage(initialTick);
}

function stopTimer(): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  targetEndTime = null;
  isPaused = false;
  pausedTimeRemaining = null;
}

function pauseTimer(): void {
  if (!targetEndTime || isPaused) return;

  isPaused = true;
  pausedTimeRemaining = Math.max(0, Math.ceil((targetEndTime - Date.now()) / 1000));
}

function resumeTimer(): void {
  if (!isPaused || pausedTimeRemaining === null) return;

  isPaused = false;
  targetEndTime = Date.now() + pausedTimeRemaining * 1000;
  pausedTimeRemaining = null;
}
