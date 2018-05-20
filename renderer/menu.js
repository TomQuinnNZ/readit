//Modules
const {remote, shell} = require('electron')

// menu template object
const template = [
  {
    label: 'Items',
    submenu: [
      {
        label: 'Add New',
        accelerator: 'CmdOrCtrl+O',
        click () { $('.open-add-modal').click()}
      },
      {
        label: 'Read Item',
        accelerator: 'CmdOrCtrl+Enter',
        click () {window.openItem()}
      },
      {
        label: 'Delete Item',
        accelerator: 'CmdOrCtrl+Backspace',
        click () {window.deleteItem()}
      },
      {
        label: 'Open in Browser',
        accelerator: 'CmdOrCtrl+Shift+Enter',
        click () {window.openInBrowser()}
      },
      {
        type: 'separator',
      },
      {
        label: 'Search Items',
        accelerator: 'CmdOrCtrl+S',
        click () {$('#search').focus()}
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {role: 'undo'},
      {role: 'redo'},
      {type: 'separator'},
      {role: 'cut'},
      {role: 'copy'},
      {role: 'paste'},
      {role: 'pasteandmatchstyle'},
      {role: 'delete'},
      {role: 'selectall'}
    ]
  },
  {
    role: 'window',
    submenu: [
      {role: 'minimize'},
      {role: 'close'}
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('https://github.com/tomquinnnz') }
      }
    ]
  }
]


//add menu to app
const menu = remote.Menu.buildFromTemplate(template)
remote.Menu.setApplicationMenu(menu)
