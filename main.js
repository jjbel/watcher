const { app, BrowserWindow, Menu, ipcMain } = require('electron/main')
const path = require('node:path')
let spawn = require("child_process").spawn;


const createWindow = () => {
    const win = new BrowserWindow({
        // width: 440, // these dims fit perfectly in my top bar
        // height: 32,
        // frame: false, // remove titlebar & resizing buttons

        width: 1000,
        height: 800,

        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    const menu = Menu.buildFromTemplate([
        {
            label: app.name,
            submenu: [
                {
                    click: () => {
                        console.log('main process: Increment')
                        win.webContents.send('update-counter', 1)
                    },
                    label: 'Increment'
                },
                {
                    click: () => {
                        console.log('main process: Decrement')
                        win.webContents.send('update-counter', -1)
                    },
                    label: 'Decrement'
                }
            ]
        }

    ])
    Menu.setApplicationMenu(menu)

    win.setAlwaysOnTop(true)
    win.loadFile('index.html')
}

app.whenReady().then(() => {
    ipcMain.on('counter-value', (_event, value) => {
        console.log(value) // will print value to Node console
    })

    createWindow()

    // whats this for?
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})


// data is a js buffer
spawn("ls").stdout.on("data", (data) => {
    console.log(data.toString())
});
