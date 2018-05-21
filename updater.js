// modules
const {autoUpdater} = require('electron-updater')
const {dialog, BrowserWindow, ipcMain} = require('electron')

//enable logging
autoUpdater.logger = require('electron-log')
autoUpdater.logger.transports.file.level = 'info'

//disable auto-downloading
autoUpdater.autoDownload = false

// check for updates
exports.check = () => {

  console.log('Checking for updates...')
  autoUpdater.checkForUpdates()

  //Listen for download (update) found
  autoUpdater.on('update-available', () => {

    //track progress percent
    let downloadProgress = 0

    //prompt user to update
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Available',
      message: 'A new version of ReadIt Basic is available. Do you want to update now?',
      buttons: ['Update', 'No']
    }, (buttonIndex) => {

      // if not 'update' button, return
      if (buttonIndex !== 0) return

      //else start download and show download progress in new window
      autoUpdater.downloadUpdate()

      //create progress window
      let progressWin = new BrowserWindow({
        width: 350,
        height: 35,
        useContentSize: true,
        autoHideMenuBar: true,
        maximizable: false,
        fullscreen: false,
        fullscreenable: false,
        resizable: false
      })

      //load progress html
      progressWin.loadURL(`file://${__dirname}/renderer/progress.html`)

      //handle progress window close
      progressWin.on('closed', () => {
        progressWin = null
      })

      // listen for progress request from progressWin
      ipcMain.on('download-progress-request', (e) => {
        e.returnValue = downloadProgress
      })

      //track progress on autoUpdater
      autoUpdater.on('download-progress', (d) => {

        downloadProgress = d.percent

        //log download to the log file as it goes along
        autoUpdater.logger.info(downloadProgress)
      })

      //listen for the completed update download
      autoUpdater.on('update-downloaded', () => {

        // close progress window
        if (progressWin) {
          progressWin.close()
        }

        dialog.showMessageBox({
          type: 'info',
          title: 'Update Ready',
          message: 'A new version of ReadIt Basic is ready. Quit and install now?',
          buttons: ['Yes', 'Later']
        }, (buttonIndex) => {
          if (buttonIndex === 0) {
            autoUpdater.quitAndInstall()
          }
        })
      })

    })
  })
}
