import express from 'express';
import { BookController } from '../controllers/book.controller';

const router = express.Router();
const BookCtrl = new BookController();

// GET requests
router.route('/')
    /** GET /api/books - Get list of books */
    .get(BookCtrl.getAllBooks);

router.route('/book')
    /** GET /api/books/book - Get details of books */
    .get(BookCtrl.getBook);

router.route('/numberofbooks')
    /** GET /api/books/numberofbooks - Get number of books */
    .get(BookCtrl.numberOfBooks);

router.route('/mybooks')
    /** GET /api/books/mybooks - Get details of my books */
    .get(BookCtrl.getMyBooks);

router.route('/searchbook/:isbn')
    /** GET /api/books/mybooks - Get details of my books */
    .get(BookCtrl.searchBook);

router.route('/getratings')
    /** POST /api/books/getratings - Get ratings of a book */
    .get(BookCtrl.getRatings);

// POST requests
router.route('/addbook')
    /** POST /api/books/addbook - Add a new book */
    .post(BookCtrl.addBook);

router.route('/updatebook')
    /** POST /api/books/updatebook - Update a existing book */
    .post(BookCtrl.updateBook);

router.route('/borrowbook')
    /** POST /api/books/borrowbook - Boorow a book */
    .post(BookCtrl.borrowBook);

router.route('/returnbook')
    /** POST /api/books/returnbook - return a book */
    .post(BookCtrl.returnBook);
    
router.route('/ratebook')
    /** POST /api/books/ratebook - rate a book */
    .post(BookCtrl.rateBook);

export default router;