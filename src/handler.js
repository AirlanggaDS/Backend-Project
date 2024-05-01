const { nanoid } = require('nanoid')
const books = require('./books')

const addBooks = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

    const bookId = nanoid(16)
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt
    const finished = (readPage === pageCount) ? true : false

    const newBook = {
        bookId, name, year, author, summary,
        publisher, pageCount, readPage, finished,
        reading, insertedAt, updatedAt
    }

    books.push(newBook)

    if (name == undefined || name == "") {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        })
        response.code(400)
        return response
    } else if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400)
        return response
    }
    const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: bookId
        }
    })
    response.code(201)
    return response
}

const getAllBooks = (request, h) => {
    const { name, reading, finished } = request.query;
    let filteredBooks = [...books];
    if (name) {
        filteredBooks = filteredBooks.filter(book =>
            book.name.toLowerCase().includes(name.toLowerCase())
        );
    }
    if (reading !== undefined && (reading === '0' || reading === '1')) {
        const isReading = reading === '1';
        filteredBooks = filteredBooks.filter(book => book.reading === isReading);
    }
    if (finished !== undefined && (finished === '0' || finished === '1')) {
        const isFinished = finished === '1';
        filteredBooks = filteredBooks.filter(book => book.finished === isFinished);
    }
    if (filteredBooks.length === 0) {
        return {
          status: 'success',
          data: {
            books: []
          }
        };
      }
    return {
        status: 'success',
        data: {
            books: filteredBooks.map(book => ({
                bookId: book.bookId,
                name: book.name,
                publisher: book.publisher,
            }))
        }
    };
};


const getBookById = (request, h) => {
    const { bookId } = request.params

    const book = books.filter((n) => n.bookId === bookId)[0]

    if (book !== undefined) {
        return {
            status: 'Success',
            data: {
                book
            }
        }
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    })
    response.code(404)
    return response
}

const editBooks = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.bookId === bookId);

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    }

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    });
    response.code(404);
    return response;
};

const deleteBooks = (request, h) => {
    const { bookId } = request.params
    const index = books.findIndex((book) => book.bookId === bookId)

    if (index !== -1) {
        books.splice(index, 1)
        const response = h.response({
            status: 'Success',
            message: 'Buku berhasil dihapus'
        })

        response.code(200)
        return response
    }

    const response = h.response({
        status: 'Fail',
        message: 'Buku gagal dihapus, Id tidak ditemukan'
    })
    response.code(404)
    return response
}

module.exports = { addBooks, getAllBooks, getBookById, editBooks, deleteBooks };