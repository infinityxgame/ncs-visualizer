const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        transparent: true, // Habilita la transparencia nativa del sistema
        frame: false,       // Elimina la barra superior (cerrar, minimizar, maximizar)
        alwaysOnTop: false, // Cambia a true si quieres que flote sobre los videojuegos
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    // Maximiza la ventana para que ocupe toda la pantalla si deseas un overlay completo
    win.maximize(); 

    // Carga el archivo HTML de tu visualizador
    win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});