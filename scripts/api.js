'use strict';
/*eslint-env jquery*/

const api = (function(){

  //what do you mean by BASE_URL is private
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/trisha-jordan';

  const getItems = function(callback){
    $.getJSON(`${BASE_URL}/items`, callback);
  };


  const createItem = function(name, callback) {

    //should we use longhand? name: name
    const newItem = JSON.stringify({name});

    //do we have to wrap key/value in quotations?
    $.ajax({
      url: `${BASE_URL}/items`,
      method: 'POST',
      contentType: 'application/json',
      data: newItem, 
      success: callback
    });

  };

  const updateItem = function(id, updateData, callback){
    
    $.ajax({
      url:`${BASE_URL}/items/${id}`,
      method: 'PATCH',
      contentType: 'application/json',
      data: JSON.stringify(updateData),
      success: callback
    });



  };




  return {
    BASE_URL,
    getItems,
    createItem, 
    updateItem
  };
  
}());