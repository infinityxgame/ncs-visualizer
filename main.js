const { app, BrowserWindow, session, desktopCapturer } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 800,
        transparent: true,
        frame: true,
        alwaysOnTop: false,
        resizable: true,
        skipTaskbar: false,
        hasShadow: false,
        backgroundColor: '#00000000',
        opacity: 1,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            sandbox: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile('index.html');
}

app.disableHardwareAcceleration();

app.whenReady().then(() => {
    session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
        desktopCapturer.getSources({ types: ['screen', 'window', 'audio'] }).then((sources) => {
            const videoSource = sources.find(source => source.name.includes('Screen')) || sources[0];
            callback({ video: videoSource, audio: 'loopback' });
        });
    }, { useSystemPicker: true });

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});