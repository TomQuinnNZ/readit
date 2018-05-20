// Modules
const {BrowserWindow} = require('electron')

// BrowserWindow instance created and set as a property of exports.
exports.win

// mainWindow createWindow function
exports.createWindow = () => {
  this.win = new BrowserWindow({
    width: 800,
    height: 650,
    minWidth: 350,
    minHeight: 310
  })

  //enable devtools on load
  this.win.webContents.openDevTools()

  // Load the main window content
  this.win.loadURL(`file://${__dirname}/renderer/main.html`)

  //Handle window closed
  this.win.on('closed', () => {
    this.win = null
  })
}
