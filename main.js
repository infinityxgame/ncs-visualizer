const { app, BrowserWindow, session, desktopCapturer, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 600,
        title: 'NCS Visualizer',
        height: 600,
        transparent: true,
        frame: false,
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

    // Handler para cerrar ventana desde el renderer
    ipcMain.on('close-window', () => {
        win.close();
    });
}

//app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu-vsync');
app.commandLine.appendSwitch('enable-features', 'Vulkan');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-gpu-rasterization');

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