'use strict';
/* global Bookmark*/
const store = (function () {

  const addBookmark = function (bookmark) {
    this.bookmarks.push(bookmark);
  };

  const findById = function (id) {
    // find an item in bookmarks array by id and return it
    return this.bookmarks.find(bookmark => bookmark.id === id);
  };

  const findAndDelete = function (id) {
    this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
  };

  const toggleIsEditing = function (id) {
    const editingBookmark = this.findById(id);
    editingBookmark.isEditing = !editingBookmark.isEditing;
  };

  const toggleExpanded = function (id) {
    const expandedBookmark = this.findById(id);
    expandedBookmark.expanded = !expandedBookmark.expanded;
  };

  const setMinRating = function (num) {
    this.minRating = num;
  };

  const filterByMinRating = function () {
    return this.bookmarks.filter(bookmark => bookmark.rating >= this.minRating);
  };

  const toggleAdding = function () {
    this.adding = !this.adding;
  };

  const toggleLoading = function () {
    this.loading = !this.loading;
  };

  const setError = function (error) {
    this.error = error;
  };

  return {
    bookmarks: [],
    minRating: null,
    adding: false,
    error: null,
    loading: false,

    addBookmark,
    findById,
    toggleExpanded,
    toggleIsEditing,
    findAndDelete,
    setMinRating,
    toggleAdding,
    filterByMinRating,
    toggleLoading,
    setError,
  };
}());