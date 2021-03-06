'use strict';
/* global $, templates, store, api */

const bookmarkList = (function () {

  // generate diaplay for error handling
  function generateError (err) {
    let message = '';
    if (err.responseJSON && err.responseJSON.message) {
      message = err.responseJSON.message;
    } else {
      message = `${err.code} Server Error`;
    }

    return `
      <section class="error-content">
        <button id="cancel-error">X</button>
        <p>${message}</p>
      </section>
    `;
  }

  // functions that have to do with rendering
  function generateControlsString () {
    const controls = templates.generateControlsTemplate(store);
    return controls;
  }

  function generateBookmarkString (bookmarkList) {
    const bookmarks = bookmarkList.map(bookmark => templates.generateBookmarkTemplate(bookmark));
    return bookmarks.join('');
  }

  function render () {
    if (store.error) {
      const el = generateError(store.error);
      $('.error-container').html(el);
    } else {
      $('.error-container').empty();
    }
    
    let bookmarks = [...store.bookmarks];
    if (store.minRating) {
      bookmarks = store.filterByMinRating();
    }
    const controlsString = generateControlsString();
    const bookmarkListItemsString = generateBookmarkString(bookmarks);
    $('.js-controls-container').html(controlsString);
    $('.js-bookmark-list').html(bookmarkListItemsString);
  }

  function getItemIdFromBookmark (bookmark) {
    return $(bookmark)
      .data('item-id');
  }

  // Sort by min stars functions
  function filterByMinStars() {
    $('.js-controls-container').on('change', '.min-rating', function (e) {
      const minRating = $(e.target).val();
      store.setMinRating(minRating);
      render();
    });
  }

  function clearMinRating() {
    $('.js-controls-container').on('click', '.clear-min-rating', function () {
      store.setMinRating(null);
      render();
    });
  }

  // Add bookmark form functionality
  function toggleAddAndRender() {
    store.toggleAdding();
    render();
  }

  function handleBackOnAddForm () {
    $('.js-controls-container').on('click', '.back-to-default', function () {
      toggleAddAndRender();
    });
  }

  function handleAddBookmarkForm() {
    $('.js-controls-container').on('click', '.add-bookmark', function () {
      toggleAddAndRender();
    });
  }

  function handleAddBookmarkSubmit () {
    // this function will be responsible for listening for the submit even on the 
    // add bookmark form ('#js-add-bookmark-form')
    handleAddBookmarkForm();
    $('.js-controls-container').on('submit', '#js-add-bookmark-form', function (e) {
      e.preventDefault();
      // grab data from form (will use another function for this)
      const formData = $(e.target).serializeJSON();
      // submit post request to API with data from the form
      api.createBookmark(formData, 
        (response) => {
          store.addBookmark(response);
          toggleAddAndRender();
        },  
        (err) => {
          store.setError(err);
          toggleAddAndRender();
        } 
      );
      // clear all form fields
      $(e.target).children().val('');
    });
  }

  // Delete functionality
  function handleDeleteItem() {
    // this function will attach and event listener on the remove button
    // that is present on each bookmark
    $('.js-bookmark-list').on('click', '.remove', function (e) {
      const bookmark = $(e.currentTarget.parentElement);
      const id = getItemIdFromBookmark(bookmark);
      api.deleteBookmark(id,
        () => {
          store.findAndDelete(id);
          render();
        },
        (err) => {
          store.setError(err);
          render();
        }
      );
    });
  }

  // Expand and Collapse Bookmark functions
  function findToggleExpandAndRender(e) {
    const bookmark = $(e.currentTarget.parentElement);
    const id = getItemIdFromBookmark(bookmark);
    store.toggleExpanded(id);
    render();
  }

  function handleExpandBookmark() {
    $('.js-bookmark-list').on('click', '.expand', function (e) {
      findToggleExpandAndRender(e);
    });
  }

  function handleCollapseBookmark() {
    $('.js-bookmark-list').on('click', '.collapse', function (e) {
      findToggleExpandAndRender(e);
    });
  }

  function clearError() {
    $('.error-container').on('click', '#cancel-error', function () {
      store.setError(null);
      render();
    });
  }

  // Edit Bookmark functions
  function handleEditSubmit () {
    // this function will handle the submit event on the edit form 
    // i'll grab the data from the form upon submitting
    // the func will then call to the api with the new data
    // and re-render the page with the new edited data
  }

  function handleEditBookMark () {
    // this function will be responsible for editing the bookmark while it's in the list
    // first I'll listen for a click even on the edit button
    // that will cause the isEditing property on the individual bookmark object that matches
    // the one that was clicked
    // will re-render the book mark view as to be able to edit it with a form
    // handle the submit
    // function handleEditSubmit()
  }

  function bindEventListeners() {
    // this function will invoke any function that uses an event listener
    // it will then be passed to the $.document.ready() in index.js so the
    // listeners can be bound at page load
    handleAddBookmarkSubmit();
    filterByMinStars();
    handleBackOnAddForm();
    handleDeleteItem();
    handleExpandBookmark();
    handleCollapseBookmark();
    clearMinRating();
    clearError();
  }
  return {
    render,
    bindEventListeners,
  };
}());