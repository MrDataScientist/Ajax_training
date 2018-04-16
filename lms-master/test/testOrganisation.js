'use strict';

const DataStore = artifacts.require('../contracts/DataStore.sol');
const Organisation = artifacts.require('../contracts/Organisation.sol');
const sha3 = require('solidity-sha3').default;
// web3.sha3 behaves a little differently than Ethereum's or Solidity's sha3.
// As a workaround, we have used solidity-sha3.
// TODO: Use solidity-sha3 npm package instead of tarball.
// Do this once this open PR gets merged: https://github.com/raineorshine/solidity-sha3/pull/1


contract('Organisation', function(accounts) {
    let bookStore, memberStore, org;

    beforeEach(async function() {
        bookStore = await DataStore.new();
        memberStore = await DataStore.new();
        org = await Organisation.new({value: web3.toWei(0.1)});
        // Transfer ownership of stores from default account to organisation. This allows modifying the data store.
        bookStore.transferOwnership(org.address);
        memberStore.transferOwnership(org.address);
        await org.setDataStore(bookStore.address, memberStore.address);
        await org.addMember('name', 'email', accounts[0]);
        // await org.setDataStore(0x0, 0x0);
        // TODO Investigate why org works with 0x0 data stores too.
    });

    describe('addMember', function() {
        it('should add the member', async function() {
            let count = await org.memberCount();
            assert.equal(count.valueOf(), 1);
            let member = await org.getMember(1);
            let attr = member.split(';');
            assert.equal(attr[0], '1');
            assert.equal('0x' + attr[1], accounts[0]);
            assert.equal(attr[2], '0');
            assert.isAtMost(attr[3], Math.floor(Date.now() / 1000));
            assert.isAbove(attr[3], Math.floor(Date.now() / 1000) - 300);
        });
        it('should not add the member again', async function() {
            let count = await org.memberCount();
            assert.equal(count.valueOf(), 1);

            let res = await org.addMember('name', 'email', accounts[0]);
            assert.equal(res.logs[0].args.statusCode.c[0], 102);
        });
    });

    describe('removeMember', function() {
        it('should deactivate the member', async function() {
            await org.removeMember(accounts[0]);
            let count = await org.memberCount();
            assert.equal(count.valueOf(), 1);
            let member = await org.getMember(1);
            let attr = member.split(';');
            assert.equal(attr[0], '1');
            assert.equal('0x' + attr[1], accounts[0]);
            assert.equal(attr[2], '1');
            assert.isAtMost(attr[3], Math.floor(Date.now() / 1000));
            assert.isAbove(attr[3], Math.floor(Date.now() / 1000) - 300);
        });
    });

    describe('getAllMembers', function() {
        it('should provide details of all members', async function() {
            let info = [
                {name: 'John Doe', email: 'john.doe@gmail.com'},
                {name: 'Jane Doe', email: 'jane.doe@gmail.com'},
                {name: 'Johnny Appleseed', email: 'johnny@apple.com'},
            ];
            for (let i=0; i<3; i++) {
                await org.addMember(info[i].name, info[i].email, accounts[i+1]);
            }
            let [members, count] = await org.getAllMembers();
            assert.equal(count, 4);     // Including the default member
            members = members.split('|');
            for (let i=1; i<4; i++) {
                let attr = members[i].split(';');
                assert.equal(attr[0], i+1);     // ID starts from 1, not 0.
                assert.equal('0x' + attr[1], accounts[i]);
                assert.equal(attr[2], '0');
                assert.isAtMost(attr[3], Math.floor(Date.now() / 1000));
                assert.isAbove(attr[3], Math.floor(Date.now() / 1000) - 300);

                let name = await memberStore.getStringValue(sha3('name', i+1));
                let email = await memberStore.getStringValue(sha3('email', i+1));
                assert.equal(name, info[i-1].name);
                assert.equal(email, info[i-1].email);
            }
        });
    });

    describe('addBook', function() {
        it('should add a book with given details', async function() {
            await org.addBook(9781234512345);
            let count = await org.bookCount();
            assert.equal(count.valueOf(), 1);
            let book = await org.getBook(1);
            let bookAttr = book.split(';');
            assert.equal(bookAttr[0], '1');
            assert.equal(bookAttr[1], '9781234512345');
            assert.equal(bookAttr[2], '0');
            assert.equal('0x' + bookAttr[3], accounts[0]);
            assert.equal('0x' + bookAttr[4], 0x0);
            assert.isAtMost(bookAttr[5], Math.floor(Date.now() / 1000));
            assert.isAbove(bookAttr[5], Math.floor(Date.now() / 1000) - 300);
            assert.equal(bookAttr[6], '0');
            assert.equal(bookAttr[7], '0');
            assert.equal(bookAttr[8], '0');
        });
        it("Should add a book and add endowment in owner's account", async function() {
            let ownerBal1 = web3.eth.getBalance(accounts[0]);
            let contractBal1 =  web3.eth.getBalance(org.address);
            await org.addBook(9781234512345);
            let ownerBal2 = web3.eth.getBalance(accounts[0]);
            let contractBal2 =  web3.eth.getBalance(org.address);
            assert.isAtMost(ownerBal2.minus(ownerBal1), 10**12);
            assert.equal(contractBal1.minus(contractBal2), 10**12);
        });
        it('should add multiple books', async function() {
            await org.addMember('another account', 'Jd@gmail.com', accounts[1]);
            let ISBNs = [9780001112222, 9780001113333, 9780001114444];
            for (let i = 0; i < 3; i++) {
                await org.addBook(ISBNs[i], {from: accounts[1]});
                let bookCount = await org.bookCount();
                assert.equal(bookCount.valueOf(), i+1);
            }
            let bookCount = await org.bookCount();
            assert.equal(bookCount.valueOf(), 3);
            let [books, count] = await org.getAllBooks();
            assert.equal(count.valueOf(), 3);
            books = books.split('|');
            for (let i = 0; i < count; i++) {
                let bookAttr = books[i].split(';');
                assert.equal(bookAttr[0], i+1);
                assert.equal(bookAttr[1], ISBNs[i]);
                assert.equal(bookAttr[2], '0');
                assert.equal('0x' + bookAttr[3], accounts[1]);
                assert.equal('0x' + bookAttr[4], 0x0);
                assert.isAtMost(bookAttr[5], Math.floor(Date.now() / 1000));
                assert.isAbove(bookAttr[5], Math.floor(Date.now() / 1000) - 300);
                assert.equal(bookAttr[6], '0');
                assert.equal(bookAttr[7], '0');
                assert.equal(bookAttr[8], '0');
            }
        });
        it('should not allow non-members to add a book', async function() {
            await org.removeMember(accounts[0]);
            let res = await org.addBook(9781234512345);
            assert.equal(res.logs[0].args.statusCode.c[0], 100);
            let res1 = await org.addBook(9781234512341, {from: accounts[1]});
            assert.equal(res1.logs[0].args.statusCode.c[0], 100);
        });
        it('should not allow contract to add a book if balance is less than reward 10**2', async function() {
            let bookStore1 = await DataStore.new();
            let memberStore1 = await DataStore.new();
            let org1 = await Organisation.new({value: web3.toWei(0.0000000000001)});
            bookStore1.transferOwnership(org1.address);
            memberStore1.transferOwnership(org1.address);
            await org1.setDataStore(bookStore1.address, memberStore1.address);
            await org.removeMember(accounts[0]);
            await org1.addMember('name', 'email', accounts[0]);
            let res = await org1.addBook(9781234512345);
            assert.equal(res.logs[0].args.statusCode.c[0], 120);
        });
    });

    describe('getBook', function() {
        it('should throw an error for a non-existent index', async function() {
            let res = await org.getBook(-1);
            assert.equal(res, '');
            let res2 = await org.getBook(0);
            assert.equal(res2, '');
            let res3 = await org.getBook(2);
            assert.equal(res3, '');
        })
    });

    describe('getAllBooks', function() {
        it('should return all books, irrespective of who owns them', async function() {
            await org.addMember('name1', 'email1', accounts[1]);
            await org.addMember('name2', 'email2', accounts[2]);
            let ISBNs = [9780001112222, 9780001113333, 9780001114444];
            for (let i = 0; i < 3; i++) {
                await org.addBook(ISBNs[i], {from: accounts[i]});
            }
            let bookCount = await org.bookCount();
            assert.equal(bookCount.valueOf(), 3);
            let [books, count] = await org.getAllBooks();
            assert.equal(count.valueOf(), 3);
            books = books.split('|');
            for (let i = 0; i < count; i++) {
                let bookAttr = books[i].split(';');
                assert.equal(bookAttr[0], i+1);
                assert.equal(bookAttr[1], ISBNs[i]);
                assert.equal(bookAttr[2], '0');
                assert.equal('0x' + bookAttr[3], accounts[i]);
                assert.equal('0x' + bookAttr[4], 0x0);
                assert.isAtMost(bookAttr[5], Math.floor(Date.now() / 1000));
                assert.isAbove(bookAttr[5], Math.floor(Date.now() / 1000) - 300);
                assert.equal(bookAttr[6], '0');
                assert.equal(bookAttr[7], '0');
                assert.equal(bookAttr[8], '0');
            }
        });
    });

    describe('borrowBook', function() {
        it('should set borrower details', async function() {
            await org.addBook(9781234512345);
            await org.addMember('name1', 'email1', accounts[1]);
            await org.borrowBook(1, {from: accounts[1], value: web3.toWei(0.1) /2 });
            let book = await org.getBook(1);
            let bookAttr = book.split(';');
            assert.equal(bookAttr[0], '1');
            assert.equal(bookAttr[1], '9781234512345');
            assert.equal(bookAttr[2], '1');                 // State changed to 1
            assert.equal('0x' + bookAttr[3], accounts[0]);
            assert.equal('0x' + bookAttr[4], accounts[1]);  // Borrower address
            assert.isAtMost(bookAttr[5], Math.floor(Date.now() / 1000));
            assert.isAbove(bookAttr[5], Math.floor(Date.now() / 1000) - 300);
            assert.isAtMost(bookAttr[6], Math.floor(Date.now() / 1000));
            assert.isAbove(bookAttr[6], Math.floor(Date.now() / 1000) - 300);
            assert.equal(bookAttr[7], '0');
            assert.equal(bookAttr[8], '0');
        });
        it("should not allow borrowing book if value send is less than 10**12", async function() {
            await org.addBook(9781234512345);
            await org.addMember('Michael Scofield', "Ms@gmail.com", accounts[2]);
            let res1 = await org.borrowBook(1, {from: accounts[2], value: 10000});
            assert.equal(res1.logs[0].args.statusCode.c[0],123);
        });
        it("should not allow non-member to borrow book ", async function() {
            await org.addBook(9781234512345);
            let res = await org.borrowBook(1, {from: accounts[1], value: 10**12});
            assert.equal(res.logs[0].args.statusCode.c[0],100);
        });
        it.skip('should borrow book and transfer 50% weis to owner account', async function() {
            await org.addBook(9781234512345);
            await org.addMember('Michael Scofield', "Ms@gmail.com", accounts[2]);
            // Balance before borrow book
            let ownerBal1 = web3.fromWei(web3.eth.getBalance(accounts[0]));
            let borrowBal1 = web3.fromWei(web3.eth.getBalance(accounts[2]));
            let contractBal1 = web3.fromWei(web3.eth.getBalance(org.address));
            // Borrowing Book with passing atleast minimun Book Issuance Amount
            await org.borrowBook(1, {from: accounts[2], value: web3.toWei(0.1)});
            // Balance after borrow book
            let ownerBal2 = web3.fromWei(web3.eth.getBalance(accounts[0]));
            let borrowBal2 = web3.fromWei(web3.eth.getBalance(accounts[2]));
            let contractBal2 = web3.fromWei(web3.eth.getBalance(org.address));
            // assert statements comparing the balances
            assert.equal((contractBal2.minus(contractBal1)).valueOf(), 0.05);
            assert.equal((ownerBal2.minus(ownerBal1)).valueOf(), 0.05);
            assert.isAtLeast((borrowBal1.minus(borrowBal2)).valueOf(), 0.1);
            // TODO - Include Gas esimation price in borrowers balance check
        });
        it('should not allow borrowing books that are already borrowed', async function() {
            await org.addBook(9781234512345);
            await org.borrowBook(1, {from: accounts[0], value: web3.toWei(0.1)});
            let res = await org.borrowBook(1, {from: accounts[0], value: web3.toWei(0.1)});
            assert.equal(res.logs[0].args.statusCode.c[0],124);
        });
        it("should not allow borrowing books that don't exist", async function() {
            let res = await org.borrowBook(1, {from: accounts[0], value: web3.toWei(0.1)});
            assert.equal(res.logs[0].args.statusCode.c[0],124);
        });
        it('should set the borrower, issue date and state', async function() {
            await org.addBook(9781234512345);
            await org.addMember('Johnny', "J@gmail.com", accounts[1]);
            await org.borrowBook(1, {from: accounts[1], value: web3.toWei(0.1)});

            let book = await org.getBook(1);
            let bookAttr = book.split(';');

            assert.equal(bookAttr[0], 1);
            assert.equal(bookAttr[1], 9781234512345); // isbn
            assert.equal(bookAttr[2], 1); //state
            assert.equal('0x' + bookAttr[3], web3.eth.coinbase); // owner address
            assert.equal('0x' + bookAttr[4], accounts[1]); // borrower address
            assert.isAtMost(bookAttr[5], Math.floor(Date.now() / 1000)); // dateAdded
            assert.isAbove(bookAttr[5], Math.floor(Date.now() / 1000) - 300);
            assert.isAtMost(bookAttr[6], Math.floor(Date.now() / 1000)); // dateIssues
            assert.isAbove(bookAttr[6], Math.floor(Date.now() / 1000) - 300);
            assert.equal(bookAttr[7], '0');
            assert.equal(bookAttr[8], '0');
        });
        it("should generate Borrow event log", async function() {
            await org.addBook(9781234512345);
            await org.addMember('Johnny', "J@gmail.com", accounts[1]);
            let res = await org.borrowBook(1, {from: accounts[1], value: web3.toWei(0.1)});
            let borrowEvent = bookStore.Event({fromBlock: 0});
            borrowEvent.watch(function(err, result) {
                borrowEvent.stopWatching();
                if (err) { throw err; }
                assert.equal(result.args.index, 1);
                assert.equal(result.args.account, accounts[1]);
                assert.equal(result.args.eventName, 'borrow')
                assert.isAtMost(result.args.timestamp, Math.floor(Date.now() / 1000));
                assert.isAbove(result.args.timestamp, Math.floor(Date.now() / 1000) - 300);
            });
        });
    });

    describe('returnBook', function() {
        it('should reset borrower details', async function() {
            await org.addBook(9781234512345);
            await org.addMember('name1', 'email1', accounts[1]);
            await org.borrowBook(1, {from: accounts[1]});
            await org.returnBook(1);
            let book = await org.getBook(1);
            let bookAttr = book.split(';');
            assert.equal(bookAttr[0], '1');
            assert.equal(bookAttr[1], '9781234512345');
            assert.equal(bookAttr[2], '0');
            assert.equal('0x' + bookAttr[3], accounts[0]);
            assert.equal('0x' + bookAttr[4], 0x0);
            assert.isAtMost(bookAttr[5], Math.floor(Date.now() / 1000));
            assert.isAbove(bookAttr[5], Math.floor(Date.now() / 1000) - 300);
            assert.equal(bookAttr[6], '0');
            assert.equal(bookAttr[7], '0');
            assert.equal(bookAttr[8], '0');
        });
        it("should not allow returning books that don't exist", async function() {
            let res = await (org.returnBook(1));
            assert.equal(res.logs[0].args.statusCode.c[0],126);
        });
        it('should not allow returning books that have not been issued', async function() {
            await org.addBook(9781234512345);
            let res = await (org.returnBook(1));
            assert.equal(res.logs[0].args.statusCode.c[0],126);
        });
        it('should reset the borrower, issue date and state', async function() {
            await org.addBook(9781234512345);
            let orig = await org.getBook(1);
            await org.addMember('Michael Scofield', "Ms@gmail.com", accounts[2]);
            await org.borrowBook(1, {from: accounts[2], value: 10**12})
            await org.returnBook(1);
            let book = await org.getBook(1);
            assert.equal(book, orig);
        });
        it('should allow only the book owner to return the book', async function() {
            // Add a member with a book
            await org.addMember('Other', "O@gmail.com", accounts[1]);
            await org.addBook(9781234512345, {from: accounts[1]});
            // Default member borrows the book
            await org.borrowBook(1, {from: accounts[0], value: 10**12});
            // Default member tries to return the book
            let res = await (org.returnBook(1));
            assert.equal(res.logs[0].args.statusCode.c[0],126);
            // Book owner successfully returns the book
            await org.returnBook(1, {from: accounts[1]});
        });
        it("should generate Return event log", async function() {
            await org.addBook(9781234512345);
            await org.addMember('Johnny', "J@gmail.com", accounts[1]);
            await org.borrowBook(1, {from: accounts[1], value: 10**12});
            let res = await org.returnBook(1);
            let returnEvent = bookStore.Event({fromBlock: 0});
            returnEvent.watch(function(err, result) {
                returnEvent.stopWatching();
                if (err) { throw err; }
                assert.equal(result.args.index, 1);
                assert.equal(result.args.account, accounts[1]);
                assert.equal(result.args.eventName, 'return');
                assert.isAtMost(result.args.timestamp, Math.floor(Date.now() / 1000));
                assert.isAbove(result.args.timestamp, Math.floor(Date.now() / 1000) - 300);
            });
        });
    });

     describe('rateBook', function() {
        it('should allow a member to rate and write descriptive reviews of a book', async function() {
            await org.addBook(9781234512345);
            await org.rateBook(1, 5, 0, 'Great book on Solidity testing!');
            let book = await org.getBook(1);
            let bookAttr = book.split(';');
            assert.equal(bookAttr[0], '1');
            assert.equal(bookAttr[1], '9781234512345');
            assert.equal(bookAttr[2], '0');
            assert.equal('0x' + bookAttr[3], accounts[0]);
            assert.equal('0x' + bookAttr[4], 0x0);
            assert.isAtMost(bookAttr[5], Math.floor(Date.now() / 1000));
            assert.isAbove(bookAttr[5], Math.floor(Date.now() / 1000) - 300);
            assert.equal(bookAttr[6], '0');
            assert.equal(bookAttr[7], '5');
            assert.equal(bookAttr[8], '1');
        });
        it('should not allow rating a non-existing book', async function() {
            let res = await org.rateBook(1, 5, 0, "A must-read classic!");
            assert.equal(res.logs[0].args.statusCode.c[0],127);
        });
        it('should not allow rating a book with invalid rating i.e. rate<1 or rate>5', async function() {
            await org.addBook(9781234512345);
            let res = await org.rateBook(1, 0, 0, "A must-read classic!");
            assert.equal(res.logs[0].args.statusCode.c[0],127);
        });
        it('should allow a member to rate multiple times and fetch the ratings from event logs', async function() {
            await org.addBook(9781234512345);
            let reviews = [
                {bookId: 1, rating: 5, oldrating: 0, comments: 'A must-read classic!'},
                {bookId: 1, rating: 4, oldrating: 5, comments: 'Great Book, I loved it'},
                {bookId: 1, rating: 3, oldrating: 4, comments: 'Decent book, not my types though'},
                {bookId: 1, rating: 2, oldrating: 3, comments: 'Hell No!, Boring book'}
            ]
            for (let i = 0; i <= 3; i++) {
                await org.rateBook(reviews[i].bookId, reviews[i].rating, reviews[i].oldrating, reviews[i].comments);
            }
            let rateEvent = bookStore.Event({}, {fromBlock: 0, toBlock: 'latest'});
            let i = 0;
            let book = await org.getBook(1);
            let bookAttr = book.split(';');
            rateEvent.watch(function(err, result) {
                rateEvent.stopWatching();
                if (!err) {
                    assert.equal(reviews[i].bookId, result.args.index);
                    assert.equal(reviews[i].rating, result.args.number);
                    assert.equal(reviews[i].comments, result.args.value);
                    assert.equal(accounts[0], result.args.account);
                    assert.equal('rate', result.args.eventName);
                    assert.isAtMost(result.args.timestamp, Math.floor(Date.now() / 1000));
                    assert.isAbove(result.args.timestamp, Math.floor(Date.now() / 1000) - 300);
                    i++;
                }
            });
        });
        it('should allow multiple members to rate a book and fetch ratings of that particular book from events', async function() {
            await org.addBook(9781234512345);
            await org.addBook(9781234512346);
            await org.addMember("Chandan", "C@gmail.com", accounts[1]);
            await org.addMember("Neel", "N@gmail.com", accounts[2])
            await org.addMember("Pawan", "P@gmail.com", accounts[3])
            let reviews = [
                {bookId: 1, rating: 5, comments: 'A must-read classic!', oldrating: 0},
                {bookId: 1, rating: 4, comments: 'Great Book, I loved it', oldrating: 0},
                {bookId: 2, rating: 3, comments: 'Decent book, not my types though', oldrating: 0},
                {bookId: 2, rating: 2, comments: 'Hell No!, Boring book', oldrating: 0},
            ]
            for (let i = 0; i <= 3; i++) {
                await org.rateBook(reviews[i].bookId, reviews[i].rating, reviews[i].oldrating,reviews[i].comments, {from: accounts[i]});
            }
            let book = await org.getBook(2);
            let bookAttr = book.split(';');
            let rateEvent = bookStore.Event({index: 2}, {fromBlock: 0, toBlock: 'latest'});
            let i = 2; // checking for second book hence i starts from 2
            rateEvent.watch(function(err, result) {
                rateEvent.stopWatching();
                if (!err) {
                    assert.equal(reviews[i].bookId, result.args.index);
                    assert.equal(reviews[i].rating, result.args.number);
                    assert.equal(reviews[i].comments, result.args.value);
                    assert.equal('rate', result.args.eventName);
                    assert.equal(accounts[i], result.args.account);
                    assert.isAtMost(result.args.timestamp, Math.floor(Date.now() / 1000));
                    assert.isAbove(result.args.timestamp, Math.floor(Date.now() / 1000) - 300);
                    i++;
                }
            });
            let book1 = await org.getBook(1);
            let bookAttr1 = book1.split(';');
            let book2 = await org.getBook(2);
            let bookAttr2 = book2.split(';');
            // average rating = toal rating / number of reviewers
            assert.equal((bookAttr2[7] / bookAttr2[8]), 2.5);
            assert.equal((bookAttr1[7] / bookAttr1[8]), 4.5);
        });

        it('should have no books by default', async function () {
            let count =  await org.bookCount()
            assert.equal(count, 0);
        });

        it('should have one member by default', async function() {
            let count =  await org.memberCount()
            assert.equal(count, 1);
        });
    });
});
