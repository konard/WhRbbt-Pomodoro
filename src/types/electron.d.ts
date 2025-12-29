/**
 * Type definitions for the Electron API exposed through contextBridge
 */

export interface ElectronAPI {
  // Window controls
  minimizeToTray: () => Promise<void>;
  toggleAlwaysOnTop: () => Promise<boolean>;
  isAlwaysOnTop: () => Promise<boolean>;

  // Notifications
  showNotification: (title: string, body: string) => Promise<void>;

  // App info
  platform: string;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
