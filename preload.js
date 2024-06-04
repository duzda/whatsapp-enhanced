const { contextBridge, ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
})

/*
contextBridge.exposeInMainWorld('compactMode', {
    enable: () => ipcRenderer.invoke('compact-mode:enable'),
    disable: () => ipcRenderer.invoke('compact-mode:disable'),
    get: () => ipcRenderer.invoke('compact-mode:get')
})*/
