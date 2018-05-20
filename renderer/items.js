//track items in an array
exports.toreadItems = JSON.parse(localStorage.getItem('toreadItems')) || []

//save items to localstorage
exports.saveItems = () => {
  localStorage.setItem('toreadItems', JSON.stringify(this.toreadItems))
}

exports.selectItem = (e) => {
  //disable 'is-active' from all other items
  $('.read-item').removeClass('is-active')
  //set 'is-active' on the element that was clicked
  $(e.currentTarget).addClass('is-active')
}

//select the next, or previous, item
exports.changeItem = (direction) => {

  //get current active item
  let activeItem = $('.read-item.is-active')

  //check direction and get next or previous read-item.
  let newItem

  if (direction === 'down') {
    newItem = activeItem.next('.read-item')
  }
  else if (direction === 'up') {
    newItem = activeItem.prev('.read-item')
  }

  //only change selected item if the item exists
  if(newItem.length) {
    activeItem.removeClass('is-active')
    newItem.addClass('is-active')
  }
}

exports.addItem = (item) => {

  //Hide "no items" message
  $('#no-items').hide()

  //New item html
  let itemHTML = `<a class="panel-block read-item" data-url="${item.url}" data-title="${item.title}">
                    <figure class="image has-shadow is-64x64 thumb">
                      <img src="${item.screenshot}">
                    </figure>
                    <h2 class="title is-4 column">${item.title}</h2>
                  </a>`

  $('#read-list').append(itemHTML)

  //attach "select" event listener
  //first, disable all other active 'click' events, then call selectItem
  $('.read-item').off('click').on('click', this.selectItem)

  //listener for a double-click on the item
  //first, disable all other active 'dblclick' events, then call openItem
  $('.read-item').off('dblclick').on('dblclick', window.openItem)
}

// Window function
// Delete item by index
window.deleteItem = (i = false) => {

  //set i to active item if not passed as an argument
  if (i === false) {
    i = $('.read-item.is-active').index() - 1
  }

  //remove item from the read-item DOM element
  // eq() references the array, so index starts at 0 (unlike jquery, which
  //starts at 1)
  $('.read-item').eq(i).remove()

  //remove item from the toreadItems array
  this.toreadItems = this.toreadItems.filter((item, index) => {
    return index !== i
  })

  // update storage so deletion persists across reloads
  this.saveItems()

  //select previous item, or none if the list is empty
  if (this.toreadItems.length) {

    //if the first item was deleted, select new first item in the list,
    //otherwise select the previous item.
    let newIndex
    if (i === 0) {
      newIndex = 0
    }
    else {
      newIndex = i - 1
    }

    // assign is-active class to new index
    $('.read-item').eq(newIndex).addClass('is-active')
  }
  else {
    $('#no-items').show()
  }
}

window.openItem = () => {

  //Only open an item if at least one exists
  if (!this.toreadItems.length) {
    return
  }

  // Get selected item
  let targetItem = $('.read-item.is-active')

  //get item's url
  let contentURL = encodeURIComponent(targetItem.data('url'))

  // get item index to pass to proxy window
  let itemIndex = targetItem.index() - 1

  // reader window URL
  let readerWinURL = `file://${__dirname}/reader.html?url=${contentURL}&itemIndex=${itemIndex}`

  //open item in new proxy BrowserWindow
  let readerWin = window.open(readerWinURL, targetItem.data('title'))
}

// function for the Open in Browser menu item
window.openInBrowser = () => {
  //return nothing if there are no items
  if (!this.toreadItems.length) {
    return
  }

  // get the selected item
  let targetItem = $('.read-item.is-active')
  // open in the browser (inline require, as there isn't one)
  require('electron').shell.openExternal(targetItem.data('url'))
}
