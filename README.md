# Pomodoro Timer

A minimalist Pomodoro Timer application built with Electron, React, and Tailwind CSS.

## Features

- **Timer Modes**: Focus (25 min), Short Break (5 min), Long Break (15 min)
- **Circular Progress**: Visual indicator of time remaining
- **System Tray**: Minimizes to system tray instead of closing
- **Native Notifications**: Get notified when timer completes
- **Always on Top**: Optional setting to keep window above others
- **Dark Mode**: Beautiful dark theme by default
- **Accurate Timing**: Uses Web Worker to prevent timer drift in background

## Tech Stack

- **Electron** - Cross-platform desktop app
- **Vite** - Fast build tool
- **React** - UI framework with functional components and hooks
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

## Project Structure

```
pomodoro-timer/
├── electron/
│   ├── main.ts          # Electron main process
│   └── preload.ts       # Preload script for IPC
├── src/
│   ├── components/      # React components
│   ├── hooks/           # Custom hooks (useTimer)
│   ├── types/           # TypeScript type definitions
│   ├── workers/         # Web Worker for accurate timing
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # React entry point
│   └── index.css        # Global styles
├── public/              # Static assets
└── package.json
```

## Usage

1. Select a timer mode (Focus, Short Break, Long Break)
2. Click the play button to start the timer
3. Click pause to pause, or reset to start over
4. Open settings (gear icon) to toggle "Always on Top"
5. Close the window to minimize to system tray

## License

MIT