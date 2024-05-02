const { nanoid } = require('nanoid')
const books = require('./books')

const addBooks = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

    const id = nanoid(16)
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt
    const finished = (readPage === pageCount) ? true : false

    const newBook = {
        id, name, year, author, summary,
        publisher, pageCount, readPage, finished,
        reading, insertedAt, updatedAt
    }

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

    books.push(newBook)

    const isSuccess = books.filter((book) => book.id === id).length > 0
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id
            }
        })
        response.code(201)
        return response
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan'
    })
    response.code(500)
    return response

}


const getAllBooks = (request, h) => {
    const { name, reading, finished } = request.query;
    let filteredBooks = [...books];

    if (name) {
        const searchTerm = name.toLowerCase();
        filteredBooks = filteredBooks.filter(book =>
            book.name.toLowerCase().includes(searchTerm)
        );
    }

    if (reading === 'true' || reading === 'false' || reading === '1' || reading === '0') {
        const isReading = reading === 'true' || reading === '1';
        filteredBooks = filteredBooks.filter(book => book.reading === isReading);
    }
    
    if (finished === 'true' || finished === 'false' || finished === '1' || finished === '0') {
        const isFinished = finished === 'true' || finished === '1';
        filteredBooks = filteredBooks.filter(book => book.finished === isFinished);
    }
    

    let responseBooks = [];

    if (filteredBooks.length > 0) {
        responseBooks = filteredBooks.map(book => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
        }));
    } else {
        const response = h.response({
            status: 'success',
            data: {
                books: []
            }
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'success',
        data: {
            books: responseBooks
        }
    });

    response.code(200);
    return response;
};


const getBookById = (request, h) => {
    const { bookId } = request.params

    const book = books.filter((book) => book.id === bookId)[0]

    if (book !== undefined) {
        const response = h.response({
            status: 'success',
            data: {
                book
            }
        })
        response.code(200)
        return response
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
    const index = books.findIndex((book) => book.id === bookId);

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
    const index = books.findIndex((book) => book.id === bookId)

    if (index !== -1) {
        books.splice(index, 1)
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        })
        response.code(200)
        return response
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    response.code(404)
    return response
}

module.exports = { addBooks, getAllBooks, getBookById, editBooks, deleteBooks };