/**
 * Electron Main Process
 *
 * Handles:
 * - Window creation and management
 * - System tray integration
 * - IPC communication with renderer
 * - Native notifications
 * - Always on top functionality
 */

import { app, BrowserWindow, Tray, Menu, ipcMain, Notification, nativeImage } from 'electron';
import { join } from 'path';

// Disable hardware acceleration for better compatibility
// app.disableHardwareAcceleration();

// The built directory structure
// - dist-electron/main.js
// - dist/index.html
const RENDERER_DIST = join(__dirname, '../dist');
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuitting = false;

/**
 * Create the main application window
 */
function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 550,
    minWidth: 350,
    minHeight: 500,
    resizable: true,
    frame: true,
    transparent: false,
    backgroundColor: '#0f0f0f',
    titleBarStyle: 'default',
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
    show: false, // Don't show until ready
    icon: join(__dirname, '../public/icon.png'),
  });

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // Handle window close - minimize to tray instead
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  // Load the app
  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
    // Open DevTools in development
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(RENDERER_DIST, 'index.html'));
  }
}

/**
 * Create a simple tray icon programmatically
 */
function createTrayIcon(): nativeImage {
  const size = 16;
  // Create a simple red circle icon for the tray
  // This is a minimal 16x16 PNG with a red tomato-like circle
  const iconData = Buffer.alloc(size * size * 4);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size / 2 - 1;
      const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

      if (dist <= radius) {
        // Inside the circle - red color
        iconData[idx] = 239;     // R
        iconData[idx + 1] = 68;  // G
        iconData[idx + 2] = 68;  // B
        iconData[idx + 3] = 255; // A
      } else {
        // Outside - transparent
        iconData[idx] = 0;
        iconData[idx + 1] = 0;
        iconData[idx + 2] = 0;
        iconData[idx + 3] = 0;
      }
    }
  }

  return nativeImage.createFromBuffer(iconData, { width: size, height: size });
}

/**
 * Create the system tray icon and menu
 */
function createTray(): void {
  const trayIcon = createTrayIcon();
  tray = new Tray(trayIcon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Pomodoro Timer',
      click: () => {
        mainWindow?.show();
        mainWindow?.focus();
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip('Pomodoro Timer');
  tray.setContextMenu(contextMenu);

  // Click on tray icon shows the window
  tray.on('click', () => {
    if (mainWindow?.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow?.show();
      mainWindow?.focus();
    }
  });

  // Double-click on tray icon shows the window
  tray.on('double-click', () => {
    mainWindow?.show();
    mainWindow?.focus();
  });
}

/**
 * Set up IPC handlers for communication with renderer process
 */
function setupIPC(): void {
  // Minimize to tray
  ipcMain.handle('minimize-to-tray', async () => {
    mainWindow?.hide();
  });

  // Toggle always on top
  ipcMain.handle('toggle-always-on-top', async () => {
    if (mainWindow) {
      const isOnTop = mainWindow.isAlwaysOnTop();
      mainWindow.setAlwaysOnTop(!isOnTop);
      return !isOnTop;
    }
    return false;
  });

  // Check if always on top
  ipcMain.handle('is-always-on-top', async () => {
    return mainWindow?.isAlwaysOnTop() ?? false;
  });

  // Show notification
  ipcMain.handle('show-notification', async (_event, title: string, body: string) => {
    if (Notification.isSupported()) {
      const notification = new Notification({
        title,
        body,
        silent: false,
      });

      notification.on('click', () => {
        mainWindow?.show();
        mainWindow?.focus();
      });

      notification.show();
    }
  });
}

// App lifecycle events
app.whenReady().then(() => {
  createWindow();
  createTray();
  setupIPC();

  // macOS: Re-create window when dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      mainWindow?.show();
    }
  });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle app quit
app.on('before-quit', () => {
  isQuitting = true;
});

// Handle second instance (single instance lock)
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, focus our window
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });
}
