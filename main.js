const { app, BrowserWindow, ipcMain, dialog } = require('electron/main');
const path = require('path');
const fs = require('fs');

// Auto-reload for all files in the project
require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});

const createWindow = () => {
    const win = new BrowserWindow({
        width: 335,
        height: 621,
        alwaysOnTop: true,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
        }
    });

    win.loadFile('index.html');

    ipcMain.handle('dialog:select-folder', async () => {
        const result = await dialog.showOpenDialog(win, {
            properties: ['openDirectory'],
        });
        return result.filePaths[0]; // Return the selected folder path
    });

    ipcMain.handle('get-file-stats', async (event, filePath) => {
        return new Promise((resolve, reject) => {
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    reject(err);
                } else {
                    // Convert `stats` to a plain object to avoid prototype stripping
                    resolve({
                        isFile: stats.isFile(),
                        isDirectory: stats.isDirectory(),
                        size: stats.size,
                        birthtime: stats.birthtime,
                        mtime: stats.mtime
                    });
                }
            });
        });
    });

    win.on('closed', () => {
        win = null;
    });

    win.webContents.openDevTools();
}

app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong');
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})