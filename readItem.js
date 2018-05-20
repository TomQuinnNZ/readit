
// Modules
const {BrowserWindow} = require('electron')

// BrowserWindow
let bgItemWin

// New read item method
module.exports = (initialURL, callback) => {

  // Create new offscreen BrowserWindow
  bgItemWin = new BrowserWindow({
    width: 1000,
    height: 1000,
    show: false,
    webPreferences: {
      offscreen: true
    }
  })

  // add https:// to the start of the item url if it wasn't provided
  if (initialURL.slice(0, 8) !== 'https://') {
    url = 'https://' + initialURL
  }
  else {
    url = initialURL
  }

  // Load read item
  bgItemWin.loadURL(url)

  // Wait for page to finish loading
  bgItemWin.webContents.on('did-finish-load', () => {

    // Get screenshot (thumbnail)
    bgItemWin.webContents.capturePage((image) => {

      // Get image as dataURI
      let screenshot = image.toDataURL()

      // Get page title
      let title = bgItemWin.getTitle()

      // Return new item via callback
      callback({ title, screenshot, url })

      // Clean up
      bgItemWin.close()
      bgItemWin = null
    })
  })
}
