const { app, BrowserWindow, ipcMain, nativeTheme,
    shell, /*Menu, MenuItem,*/ clipboard, Notification, nativeImage } = require('electron')
const contextMenu = require('electron-context-menu')
const path = require('path')
const fs = require('fs')
var dbus = require('dbus-native')
var sessionBus = dbus.sessionBus()

const gotTheLock = app.requestSingleInstanceLock();

contextMenu({
    prepend: (defaultActions, params, browserWindow) => [
        {
            label: 'Copy image URL',
            // Only show it when right-clicking images
            visible: params.mediaType === 'image',
            click: () => {
                clipboard.writeText(params.srcURL)
            }
        },
        {
            label: 'Open image in browser',
            // Only show it when right-clicking images
            visible: params.mediaType === 'image',
            click: () => {
                shell.openExternal(params.srcURL);
            }
        },
        {
            label: 'Reload',
            click: () => {
                browserWindow.reload();
            }
        },
        {
            label: 'Open DevTools',
            click: () => {
                browserWindow.webContents.openDevTools()
            }
        }
    ]
});

if (!gotTheLock) {
    app.quit();
} else {
    const createWindow = () => {
        const win = new BrowserWindow({
            width: 1000,
            height: 600,
            menuBarVisible: false,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                //webviewTag: true
            },
            icon: path.join(__dirname, '/images//io.github.whatsapp-enhanced.svg')
        })

        win.compactMode = true;

        win.setMenuBarVisibility(false)

        //win.loadFile('index.html')
        // We have to fake userAgent because WhatsApp really hates anything but chrome
        // and mainstream browsers
        win.loadURL('https://web.whatsapp.com/', {userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'})
        
        //win.webContents.openDevTools()
        
        win.webContents.on('did-finish-load', () => {
            fs.readFile(path.join(__dirname, 'styles.css'), 'utf-8', (err, data) => {
                if (err) {
                    console.error('An error while trying to read a file occured ', err);
                    return;
                }

                console.log('Inserting css')
                win.webContents.insertCSS(data)
            });
            /*
            fs.readFile(path.join(__dirname, 'ui_hook.js'), 'utf-8', (err, data) => {
                if (err) {
                    console.error('An error while trying to read a file occured ', err);
                    return;
                }

                console.log('Executing UI hook')
                win.webContents.executeJavaScript(data)
            });*/
            if (win.compactMode == true) {
                win.setSize(1000, 600)
                fs.readFile(path.join(__dirname, 'compact.css'), 'utf-8', (err, data) => {
                    if (err) {
                        console.error('An error while trying to read a file occured ', err);
                        return;
                    }
            
                    console.log('Inserting compact css')
                    win.webContents.insertCSS(data)
                });
            }
        })
        win.webContents.setWindowOpenHandler((details) => {
            //console.log('Requested window with details: ', details)
            shell.openExternal(details.url);
            return { action: 'deny' }
        })

    }

    /*ipcMain.handle('compact-mode:enable', async (event) => {
        const webContents = event.sender
        const win = BrowserWindow.fromWebContents(webContents)
        win.compactMode = true
        fs.readFile(path.join(__dirname, 'compact.css'), 'utf-8', (err, data) => {
            if (err) {
                console.error('An error while trying to read a file occured ', err);
                return;
            }

            console.log('Inserting compact css')
            win.webContents.insertCSS(data)
        });
        win.setSize(1000, 600)
    })

    ipcMain.handle('compact-mode:disable', async (event) => {
        const webContents = event.sender
        const win = BrowserWindow.fromWebContents(webContents)
        win.compactMode = false
        win.reload()
        win.setSize(1200, 700)
    })

    ipcMain.handle('compact-mode:get', async (event) => {
        const webContents = event.sender
        const win = BrowserWindow.fromWebContents(webContents)
        return win.compactMode
    })
    */

    app.whenReady().then(() => {
        createWindow()

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow()
        })
    })

    app.on('second-instance', () => app.focus());

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit()
    })
}
