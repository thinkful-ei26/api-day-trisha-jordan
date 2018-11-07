'use strict';
/* global store, $, api, store */
/*eslint-env jquery*/

// eslint-disable-next-line no-unused-vars
const shoppingList = (function(){

  function generateItemElement(item) {
    const checkedClass = item.checked ? 'shopping-item__checked' : '';
    const editBtnStatus = item.checked ? 'disabled' : '';

    let itemTitle = `<span class="shopping-item ${checkedClass}">${item.name}</span>`;
    if (item.isEditing) {
      itemTitle = `
        <form class="js-edit-item">
          <input class="shopping-item type="text" value="${item.name}" />
        </form>
      `;
    }
  
    return `
      <li class="js-item-element" data-item-id="${item.id}">
        ${itemTitle}
        <div class="shopping-item-controls">
          <button class="shopping-item-edit js-item-edit" ${editBtnStatus}>
            <span class="button-label">edit</span>
          </button>
          <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
          </button>
          <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
          </button>
        </div>
      </li>`;
  }
  
  
  function generateShoppingItemsString(shoppingList) {
    const items = shoppingList.map((item) => generateItemElement(item));
    return items.join('');
  }
  
  
  function render() {
    // Filter item list if store prop is true by item.checked === false
    let items = [ ...store.items ];
    if (store.hideCheckedItems) {
      items = items.filter(item => !item.checked);
    }
  
    // Filter item list if store prop `searchTerm` is not empty
    if (store.searchTerm) {
      items = items.filter(item => item.name.includes(store.searchTerm));
    }
  
    // render the shopping list in the DOM
    console.log('`render` ran');
    const shoppingListItemsString = generateShoppingItemsString(items);
  
    // insert that HTML into the DOM
    $('.js-shopping-list').html(shoppingListItemsString);
  }
  
  //>>>>>>>>>>>>>>>>>>>>>>>>>>>
  function handleNewItemSubmit() {

    $('#js-shopping-list-form').submit(function (event) {
      event.preventDefault();
      
      const newItemName = $('.js-shopping-list-entry').val();

      //add a call to local API
      api.createItem(newItemName, (newItem) => {
        store.addItem(newItem);
        $('.js-shopping-list-entry').val('');
        render();
      });
    });
  }
  
  function getItemIdFromElement(item) {
    return $(item)
      .closest('.js-item-element')
      .data('item-id');
  }
  
  // const updateItem = function(id, updateData, callback)
  //^^^^ what we're grabbing 
  //grab current store item that user is trying to check
  //then call api.updateItem
  //opposite needs to be a new object 
  function handleItemCheckClicked() {
    console.log('handleItemCheckClicked Ran');
    
    $('.js-shopping-list').on('click', '.js-item-toggle', event => {
      console.log('event running');
      const id = getItemIdFromElement(event.currentTarget);

      const checked = store.items.find(item => item.id === id).checked 
      console.log(checked)

      api.updateItem(id, {checked: !checked}, function() {
        store.findAndUpdate(id, {checked: !checked})
        console.log(store)
        render();
      }); 

      //bug: item is either always checked (WORKS-ish)
      // how do we make it so that the state of store.items.checked changes after the event. It can't be inside the api, because it's already too late
      // api.updateItem(id, {checked: false}, function() {
      //   store.findAndUpdate(id, {checked: false});
      //   render();
      // }); 

    });
  }

  
  function handleDeleteItemClicked() {
    // like in `handleItemCheckClicked`, we use event delegation
    $('.js-shopping-list').on('click', '.js-item-delete', event => {
      // get the index of the item in store.items
      const id = getItemIdFromElement(event.currentTarget);
      // delete the item
      store.findAndDelete(id);
      // render the updated shopping list
      render();
    });
  }

  // >>>>>>>>>>>>>>>>>
  function handleEditShoppingItemSubmit() {
    $('.js-shopping-list').on('submit', '.js-edit-item', event => {
      event.preventDefault();
      const id = getItemIdFromElement(event.currentTarget);
      const itemName = $(event.currentTarget).find('.shopping-item').val();
      store.findAndUpdateName(id, itemName);
      store.setItemIsEditing(id, false);

      api.createItem(id, (newName) => {
        store.addItem(newName);
        store.findAndUpdate(id, newName);
        render();
      });
    });
  }
  
  function handleToggleFilterClick() {
    $('.js-filter-checked').click(() => {
      store.toggleCheckedFilter();
      render();
    });
  }
  
  function handleShoppingListSearch() {
    $('.js-shopping-list-search-entry').on('keyup', event => {
      const val = $(event.currentTarget).val();
      store.setSearchTerm(val);
      render();
    });
  }

  function handleItemStartEditing() {
    $('.js-shopping-list').on('click', '.js-item-edit', event => {
      const id = getItemIdFromElement(event.target);
      store.setItemIsEditing(id, true);
      render();
    });
  }
  
  function bindEventListeners() {
    handleNewItemSubmit();
    handleItemCheckClicked();
    handleDeleteItemClicked();
    handleEditShoppingItemSubmit();
    handleToggleFilterClick();
    handleShoppingListSearch();
    handleItemStartEditing();
  }

  // This object contains the only exposed methods from this module:
  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };
}());
