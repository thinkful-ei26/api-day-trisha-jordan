'use strict';
/* global shoppingList, store, api, Item */
/*eslint-env jquery*/

$(document).ready(function() {
  shoppingList.bindEventListeners();
  shoppingList.render();


  api.createItem('pears', (newItem) => {
    api.getItems((items) => {
      console.log(items);
    });
  });

});

store.items.push(Item.create('apples'));

