'use strict';
/* global shoppingList, store, api, Item */
/*eslint-env jquery*/

$(document).ready(function() {
  shoppingList.bindEventListeners();
  shoppingList.render();

  api.getItems((items) => {
    items.forEach((item) => store.addItem(item));
    shoppingList.render();
  });

});


// store.items.push(Item.create('apples'));

