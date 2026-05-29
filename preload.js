const { contextBridge, ipcRenderer, desktopCapturer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getDisplayMedia: async () => {
        const sources = await desktopCapturer.getSources({
            types: ['screen', 'window']
        });
        return sources;
    },
    selectSource: async (sourceId) => {
        return await ipcRenderer.invoke('select-source', sourceId);
    }
});
