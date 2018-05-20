//Modules
const {ipcRenderer} = require('electron')
const items = require('./items.js')
const menu = require('./menu.js')

// navigate selected item with the up/down arrow keys
$(document).keydown((e) => {
  //switch statement for up/down arrow keys
  switch (e.key) {
    case 'ArrowUp':
      items.changeItem('up')
      break;
    case 'ArrowDown':
      items.changeItem('down')
      break;
  }
})

// Show add-modal
$('.open-add-modal').click(() => {
  $('#add-modal').addClass('is-active')
})

// Hide add-modal
$('.close-add-modal').click(() => {
  $('#add-modal').removeClass('is-active')
})

//Handle add-modal submission
$('#add-button').click(() => {
  //get url from input
  let newItemUrl = $('#item-input').val()
  if(newItemUrl) {

    //disable the input element while the message is sent to main
    $('#item-input').prop('disabled', true)
    $('#add-button').addClass('is-loading')
    $('.close-add-modal').addClass('is-disabled')
    //send url to main process via ipc on the "new-item" channel
    ipcRenderer.send('new-item', newItemUrl)
  }
})

//Listen for a key release event, and if its enter, log a click
//event on the add-button item.
$('#item-input').keyup((e) => {
  if (e.key === 'Enter') {
    $('#add-button').click()
  }
})

//Listen for a new item from main.js
ipcRenderer.on('new-item-success', (e, item) => {

  //Add item to the items array
  items.toreadItems.push(item)

  //save Items
  items.saveItems()

  items.addItem(item)


  //Close and reset the modal if successful
  $('#add-modal').removeClass('is-active')
  $('#item-input').prop('disabled', false).val('')
  $('#add-button').removeClass('is-loading')
  $('.close-add-modal').removeClass('is-disabled')

  // if this is the first item to be added, select it automatically
  if(items.toreadItems.length === 1) {
    $('.read-item:first()').addClass('is-active')
  }

})

//add items when app loads
if(items.toreadItems.length) {
  items.toreadItems.forEach(items.addItem)
  //select the first read-item on initial page load
  $('.read-item:first()').addClass('is-active')
}

// filter items by title (get value of #search each time a key is released)
$('#search').keyup((e) => {

  let filter = $(e.currentTarget).val()

  //loop through item titles and compare them to current value of filter
  $('.read-item').each((i, el) => {
    $(el).text().toLowerCase().includes(filter) ? $(el).show() : $(el).hide()
  })
})
