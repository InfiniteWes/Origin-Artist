const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('Origin-Artist', title),
    send: (channel, data) => {
        let validChannels = ['sidebar-to-race-page', 'request-race-data'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    // Adding the receiveData function
    receiveData: (channel, func) => {
        let validChannels = ['race-data-response']; // Add more channels as needed
        if (validChannels.includes(channel)) {
            // Use once or on depending on your needs
            // ipcRenderer.once(channel, (event, ...args) => func(...args));
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
});
