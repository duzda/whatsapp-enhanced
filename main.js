const { app, BrowserWindow, ipcMain, nativeTheme,
    shell, /*Menu, MenuItem,*/ clipboard, Notification, nativeImage } = require('electron')
const contextMenu = require('electron-context-menu')
const path = require('path')
const fs = require('fs')
var dbus = require('dbus-native')
var sessionBus = dbus.sessionBus()

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

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 600,
        menuBarVisible: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            //webviewTag: true
        },
        icon: path.join(__dirname, '/images/logo.png')
    })

    win.compactMode = true;

    win.setMenuBarVisibility(false)

    //win.loadFile('index.html')
    win.loadURL('https://web.whatsapp.com/', {userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'})
    
    //win.webContents.openDevTools()
    
    win.webContents.on('did-finish-load', () => {
        /*fs.readFile(path.join(__dirname, 'styles.css'), 'utf-8', (err, data) => {
            if (err) {
                console.error('An error while trying to read a file occured ', err);
                return;
            }

            console.log('Inserting css')
            win.webContents.insertCSS(data)
        });
        fs.readFile(path.join(__dirname, 'notifications_hook.js'), 'utf-8', (err, data) => {
            if (err) {
                console.error('An error while trying to read a file occured ', err);
                return;
            }

            console.log('Executing notifications hook')
            win.webContents.executeJavaScript(data)
        });
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
    /*win.webContents.on('context-menu', (_, props) => {
        const menu = new Menu();
        console.log('Menu requested: ', props)
        if (props.mediaType == 'image') {
            menu.append(new MenuItem({ label: 'Cut', role: 'cut' }));
            menu.append(new MenuItem({ label: 'Copy', role: 'copy' }));
            menu.append(new MenuItem({ label: 'Paste', role: 'paste' }));
        } else if (props.isEditable) {
            menu.append(new MenuItem({ label: 'Cut', role: 'cut' }));
            menu.append(new MenuItem({ label: 'Copy', role: 'copy' }));
            menu.append(new MenuItem({ label: 'Paste', role: 'paste' }));
        }

        menu.popup();
    });*/

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

ipcMain.handle('notifications:push', async (event, title, content, imageURL) => {
    const response = await fetch(imageURL);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let image = nativeImage.createFromBuffer(buffer)
    console.log(image.toDataURL())
    new Notification({
        title: title,
        body: content,
        icon: image
    }).show();
})

ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
        nativeTheme.themeSource = 'light'
    } else {
        nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
})
ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
})

// custom implementation of freedesktop darkmode switching
// because electron does not fetch this yet
sessionBus.getService('org.freedesktop.portal.Desktop').getInterface(
    '/org/freedesktop/portal/desktop',
    'org.freedesktop.portal.Settings', function (err, notifications) {

        notifications.Read('org.freedesktop.appearance', 'color-scheme', function (err, resp) {
            console.log('Current color-scheme', resp[1][0][1][0]);
            nativeTheme.themeSource = resp[1][0][1][0] ? 'dark' : 'light';
        });

        // dbus signals are EventEmitter events
        notifications.on('SettingChanged', function () {
            if (arguments['0'] == 'org.freedesktop.appearance' && arguments['1'] == 'color-scheme') {
                nativeTheme.themeSource = arguments['2'][1][0] ? 'dark' : 'light';
                console.log('SettingChanged', arguments);
            }
        });
    });
*/

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})