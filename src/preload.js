// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('Origin-Artist', title), //the context bridge exposes the ipcRenderer to the main process
    send: (channel, data) => {
        let validChannels = ['sidebar-to-race-page'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    }
});