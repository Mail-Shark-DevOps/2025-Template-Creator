const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const exec = require('child_process').exec;

contextBridge.exposeInMainWorld('api', {
    path,
    fs,
    exec,
    dirname: __dirname,
    selectFolder: async () => {
        return await ipcRenderer.invoke('dialog:select-folder');
    },
    getFileStats: (filePath) => ipcRenderer.invoke('get-file-stats', filePath),
    // applescript: require('applescript'),
    versions: {
        node: () => process.versions.node,
        chrome: () => process.versions.chrome,
        electron: () => process.versions.electron,
        ping: () => ipcRenderer.invoke('ping')
    },
});