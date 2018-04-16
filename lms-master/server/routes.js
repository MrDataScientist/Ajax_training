const request = require('request');
var contract_id =  require("../app/config.js");
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
const contract = require('truffle-contract');
const lmsArtifacts = require('../build/contracts/LMS.json');
const isbn = require('node-isbn');

const LMS = contract(lmsArtifacts)

var fs = require("fs");
var Web3 = require('web3');

if (typeof web3 !== 'undefined') {
  var web3 = new Web3(web3.currentProvider)
} else {
  var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
}

LMS.setProvider(web3.currentProvider)

var lms = LMS.at(contract_id.id);

module.exports = (app, express) => {

	const api = express.Router();

	// GET API calls
	api.get('/numberofmembers', (req, res) => {
		console.log("Displaying total number of members");
		lms.numMembers()
		.then((result) => {
			res.json({ result });
		})
		.catch((err) => {
			console.log(err);
		});
	});

	api.get('/members', (req, res) => {
		console.log("Displaying all members data");
		lms.getAllMembers()
		.then((result) => {
			res.json({ result });
		})
		.catch((err) => {
			console.log(err);
		});
	});

	api.get('/ownerdetails', (req, res) => {
		console.log("Displaying ownerdetails");
		lms.getOwnerDetails()
		.then((result) => {
			res.json({ result });
		})
		.catch((err) => {
			console.log(err);
		});
	});

	api.get('/memberdetails', (req, res) => {
		if ("email" in req.query) {
			console.log("Displaying member details by email : " + req.query.email);
			lms.getMemberDetailsByEmail(req.query.email)
			.then((result) => {
				res.json({ result });
			})
			.catch((err) => {
				console.log(err);
			});
		}
		else if ("adr" in req.query) {
			console.log("Displaying member details by account : " + req.query.adr);
			lms.getMemberDetailsByAccount(req.query.adr)
			.then((message) => {
				res.json({ message });
			})
			.catch((err) => {
				console.log(err);
			});
		}
		else if ("id" in req.query) {
			console.log("Displaying member details by index : " + req.query.id);
			lms.getMemberDetailsByIndex(req.query.id)
			.then((message) => {
				res.json({ message });
			})
			.catch((err) => {
				console.log(err);
			});
		}
	});

	api.get('/book', (req, res) => {
		if ("id" in req.query) {
			console.log("Displaying book by given index");
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
	});

	api.get('/numberofbooks', (req, res) => {
		console.log("Displaying total number of books");
		lms.numBooks()
		.then((result) => {
			res.json({ result });   
		})
		.catch((err) => {
			console.log(err);
		});
	});

	api.get('/books', (req, res) => {
		console.log("Displaying all books data");
		lms.getAllBooks()
		.then((message) => {
			res.json({ message });   
		})
		.catch((err) => {
			console.log(err);
		});
	});

	api.get('/mybooks', (req, res) => {
		console.log("Displaying all books of member");
		lms.getMyBooks()
		.then((result) => {
			res.json({ result });   
		})
		.catch((err) => {
			console.log(err);
		});
	});

	api.get('/searchbook/:isbn', (req, res) => {
		console.log("Searching books via isbn");
		isbn.resolve(req.params.isbn, (err, book) => {
			if (err) {
				console.log('Book not found', err);
				res.json({ message : "book not found" })
			} else {
				console.log('Book found %j', book);
				res.json(book);
			}
		});
	});

/*	api.get('/getratings', (req, res) => {
		console.log("Get Ratings");
		var rateEvent = lms.Rate({}, {
			fromBlock: 0,
			toBlock: 'latest'
		});
		rateEvent.watch(function(e, result) {
			rateEvent.stopWatching();
			if (e) {
				console.log("Error Occured", e)
			} else {
				res.json({ result : result.args });
			}
		});
	});*/


	// POST API calls

	// This API is not tested after the changes
	api.route('/create_account')
	// create an account
	.post(function(req, res) {
		console.log(req.body);
		request({
			url: 'http://localhost:8545',
			method: 'POST',
			json: req.body
		}, function(error, response, body) {
			console.log(error);
			if (error) {
				res.send({
					status: "failure",
					data : body
				});
			} else {
				res.send({
					status: "success",
					data: body
				});
			}
		});
	});

	api.route('/addmember')
		.post((req, res) => {
			console.log("adding a new member");
			var data = req.body;
			lms.addMember(data.name, data.address, data.email, {
					from: web3.eth.accounts[0],
					gas: 6000000
			})
			.then((result) => {
				res.json({ result });
			})
			.catch((err) => {
				console.log(err);
			});
		});

	api.route('/removemember')
		.post((req, res) => {
			console.log("removing a member with given address");
			var data = req.body;
			lms.removeMember(data.address, {
					from: data.account,
					gas: 6000000
			})
			.then((result) => {
				res.json({ result });
			})
			.catch((err) => {
				console.log(err);
			});
		});	

	api.route('/addbook')
		.post((req, res) => {
			console.log("add a new book");
			var data = req.body;
			lms.addBook(
				data.title, 
				data.author, 
				data.publisher, 
				data.imgUrl, 
				data.description, 
				data.genre, 
				{
					from: web3.eth.coinbase,
					gas: 6000000
				}
			)
			.then((receipt) => {
				console.log(receipt);
			})
			.catch((error) => {
				console.log(error)
			});
		});

	api.route('/updatebook')
		.post((req, res) => {
			console.log("update a book with given id");
			var data = req.body;
			lms.updateBook(data.id, data.title, data.author, data.publisher, data.imgUrl, data.description, data.genre, {
				from: data.account,
				gas: 6000000
			})
			.then((result) => {
				res.json({ result });
			})
			.catch((error) => {
				console.log(error)
			});
		});

	api.route('/borrowbook')
		.post((req, res) => {
			console.log("borrow a book with given id");
			var data = req.body;
			lms.borrowBook(data.id, {
				from: data.account,
				gas: 6000000
			}).then((result) => {
				res.json({ result });
			})
			.catch((error) => {
				console.log(error)
			});
		});

	api.route('/returnbook')
		.post((req, res) => {
			console.log("return a book with given id");
			var data = req.body;
			lms.returnBook(data.id, {
				from: data.account,
				gas: 6000000
			}).then((result) => {
				res.json({ result });
			})
			.catch((error) => {
				console.log(error)
			});
		});

	api.route('/ratebook')
		.post((req, res) => {
			console.log("rate a book with given id");
			var data = req.body;
			lms.rateBook(data.id, data.rating, data.comments, data.oldRating, {
				from: data.account,
				gas: 6000000
			}).then((result) => {
				res.json({ result });
			})
			.catch((error) => {
				console.log(error)
			});
		});

	return api;
}