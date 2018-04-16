import { web3, lms } from '../helpers/web3.helper'
const isbn = require('node-isbn');
import { isSuccess } from '../helpers/function.helper'

export class BookController {
    getAllBooks (req, res) {
        lms.getAllBooks()
        .then((result) => {
            res.json({ result });   
        })
        .catch((err) => {
            console.log(err);
        });
    }
    getBook(req, res){
        if ("id" in req.query) {
			lms.getBook(req.query.id)
			.then((result) => {
				res.json({ result })
			})
			.catch((err) => {
				console.log(err);
			});
		}
		else {
			res.json({ result: "book id not provided" });
		}
    }
    numberOfBooks(req, res){
		lms.numBooks()
		.then((result) => {
			res.json({ result });   
		})
		.catch((err) => {
			console.log(err);
		});
    }
    getMyBooks(req, res){
		lms.getMyBooks()
		.then((result) => {
			res.json({ result });   
		})
		.catch((err) => {
			console.log(err);
		});
    }
    searchBook(req, res){
		isbn.resolve(req.params.isbn, (err, book) => {
			if (err) {
				console.log('Book not found', err);
				res.json({ message : "book not found" })
			} else {
				console.log('Book found %j', book);
				res.json(book);
			}
		});
    }
    addBook(req, res){
		var book = req.body;
		lms.addBook(
			book.title, 
			book.author, 
			book.publisher, 
			book.imageUrl, 
			book.description, 
			book.genre, 
			{
				from: book.owner.account,
				gas: 600000
			}
		)
		.then((receipt) => {
			if(isSuccess(receipt)){
				res.json({
					result : receipt,
					status : true
				});
			}else{
				res.json({
					logs: receipt.logs[0].args.statusCode.c[0],
					status: false
				})
			}
		})
		.catch((error) => {
			console.log(error)
		});
    }
    updateBook(req, res){
		var data = req.body;
		console.log("book-data", data);
		lms.updateBook(
			data.bookId, 
			data.book.title, 
			data.book.author, 
			data.book.publisher, 
			data.book.imageUrl, 
			data.book.description, 
			data.book.genre, {
				from: data.book.owner.account,
				gas: 600000
			}
		).then((receipt) => {
			if(isSuccess(receipt)){
				res.json({
					result : receipt,
					status : true
				});
			}else{
				res.json({
					logs: receipt.logs[0].args.statusCode.c[0],
					status: false
				})
			}
		})
		.catch((error) => {
			console.log(error)
		});
    }
    borrowBook(req, res){
		var data = req.body;
		lms.borrowBook(
			data.bookId, 
			{ 
				from: data.ownerDetails.account,
				value: web3.toWei(0.1),
				gas: 200000
			}
		).then((receipt) => {
			if(isSuccess(receipt)){
				res.json({
					result : receipt,
					status : true
				});
			}else{
				res.json({
					logs: receipt.logs[0].args.statusCode.c[0],
					status: false
				})
			}
		})
		.catch((error) => {
			console.log(error)
		});
    }
    returnBook(req, res){
		var data = req.body;
		lms.returnBook(
			data.id,
			{
				from : data.owner,
				gas: 200000
			}
		).then((receipt) => {
			if(isSuccess(receipt)){
				res.json({
					result : receipt,
					status : true
				});
			}else{
				res.json({
					logs: receipt.logs[0].args.statusCode.c[0],
					status: false
				})
			}
		})
		.catch((error) => {
			console.log(error)
		});
    }
    rateBook(req, res){
		var data = req.body;
		lms.rateBook(data.bookId, data.rating, data.comment, data.oldRating, {
			from: data.account,
			gas: 300000
		}).then((receipt) => {
			if(isSuccess(receipt)){
				res.json({
					receipt,
					status : true
				});
			}else{
				res.json({
					logs: receipt.logs[0].args.statusCode.c[0],
					status: false
				})
			}
		})
		.catch((error) => {
			console.log(error)
		});
    }
	getRatings(req, res){
		lms.Rate({}, {
			fromBlock: 0,
			toBlock: 'latest'
		},(e, result) => {
			if (e) {
				res.json({
					logs: e.message,
					status: false
				})
			} else {
				res.json({
					args : result.args,
					status : true
				});
			}
		});
	}
	getRatingsUsingSocket(io, socketId){
		lms.Rate({}, {
			fromBlock: 0,
			toBlock: 'latest'
		},(e, result) => {
			if (e) {
				console.log("error in get ratings", e);
				io.to(socketId).emit('SOCKET_MSG_RATING_RECEIVE', {
					logs: e.message,
					status: false
				});
			} else {
				io.to(socketId).emit('SOCKET_MSG_RATING_RECEIVE', {
					args : result.args,
					status : true
				});
			}
		});
	}
	getBorrowEvent(io, socketId, bookId){
		lms.Borrow({ bookId }, {
			fromBlock: 0,
			toBlock: 'latest'
		},(e, result) => {
			if (e) {
				console.log("error in get ratings", e);
				io.to(socketId).emit('SOCKET_MSG_BORROW_EVENT_RECEIVE', {
					logs: e.message,
					status: false
				});
			} else {
				io.to(socketId).emit('SOCKET_MSG_BORROW_EVENT_RECEIVE', {
					args : result.args,
					status : true
				});
			}
		});
	}
	getReturnEvent(io, socketId, bookId){
		lms.Return({ bookId }, {
			fromBlock: 0,
			toBlock: 'latest'
		},(e, result) => {
			if (e) {
				console.log("error in get ratings", e);
				io.to(socketId).emit('SOCKET_MSG_RETURN_EVENT_RECEIVE', {
					logs: e.message,
					status: false
				});
			} else {
				io.to(socketId).emit('SOCKET_MSG_RETURN_EVENT_RECEIVE', {
					args : result.args,
					status : true
				});
			}
		});
	}
}