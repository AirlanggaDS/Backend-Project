const { addBooks, getAllBooks, getBookById, editBooks, deleteBooks } = require('./handler')

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBooks
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooks
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookById
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBooks
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBooks
  }
]

module.exports = routes