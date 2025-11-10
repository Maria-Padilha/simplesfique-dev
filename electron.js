const electron = require('electron');
const path = require('path');

const { app, BrowserWindow } = electron;

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:8080');
    } else {
        win.loadFile(path.join(__dirname, 'dist', 'index.html'));
    }
}

app.on('ready', createWindow);

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
