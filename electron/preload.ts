/**
 * Electron Preload Script
 *
 * This script runs in the renderer process before the web page loads.
 * It uses contextBridge to safely expose Electron APIs to the renderer.
 *
 * Security considerations:
 * - Only expose specific, necessary functions
 * - Never expose ipcRenderer directly
 * - Validate all inputs before sending to main process
 */

import { contextBridge, ipcRenderer } from 'electron';

// Expose safe APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * Minimize the window to the system tray
   */
  minimizeToTray: (): Promise<void> => {
    return ipcRenderer.invoke('minimize-to-tray');
  },

  /**
   * Toggle the always-on-top state of the window
   * @returns The new always-on-top state
   */
  toggleAlwaysOnTop: (): Promise<boolean> => {
    return ipcRenderer.invoke('toggle-always-on-top');
  },

  /**
   * Check if the window is currently always-on-top
   * @returns The current always-on-top state
   */
  isAlwaysOnTop: (): Promise<boolean> => {
    return ipcRenderer.invoke('is-always-on-top');
  },

  /**
   * Show a native system notification
   * @param title - The notification title
   * @param body - The notification body text
   */
  showNotification: (title: string, body: string): Promise<void> => {
    // Basic input validation
    if (typeof title !== 'string' || typeof body !== 'string') {
      return Promise.reject(new Error('Invalid notification parameters'));
    }
    return ipcRenderer.invoke('show-notification', title, body);
  },

  /**
   * Platform identifier
   */
  platform: process.platform,
});

// Log that preload script has loaded (for debugging)
console.log('Preload script loaded');
