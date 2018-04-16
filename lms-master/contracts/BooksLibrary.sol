pragma solidity ^0.4.0;

import "./DataStore.sol";


library BooksLibrary {

    // Status of transaction. Used for error handling.
    event Status(uint indexed statusCode);

    // Book has following states: 0 (Available), 1 (Borrowed)

    function bookCount(address bookStoreAddress) constant returns (uint count) {
        return DataStore(bookStoreAddress).count();
    }

    function addBook(address bookStoreAddress, uint isbn13) public {
        if (this.balance < 10**12) {
            Status(120);
            return;
        }
        if (!msg.sender.send(10**12)) {
            Status(121);
            return;
        }
        var bookStore = DataStore(bookStoreAddress);
        bookStore.addNew();
        // TODO Find if addNew can be called simultaneously. If yes, the below index will not point to correct entry.
        var index = bookStore.count();

        bookStore.setIntValue(sha3('isbn', index), isbn13);
        bookStore.setIntValue(sha3('dateAdded', index), now);
        bookStore.setAddressValue(sha3('owner', index), msg.sender);
    }

    function getBook(address bookStoreAddress, uint id) constant returns (uint index, uint isbn, uint state, address owner, address borrower, uint dateAdded, uint dateIssued, uint totalRating, uint reviewersCount) {
        var bookStore = DataStore(bookStoreAddress);
        if (id < 1 || id > bookStore.count()) {
            return;
        }
        index = id;
        isbn = bookStore.getIntValue(sha3('isbn', id));
        state = bookStore.getIntValue(sha3('state', id));
        owner = bookStore.getAddressValue(sha3('owner', id));
        borrower = bookStore.getAddressValue(sha3('borrower', id));
        dateAdded = bookStore.getIntValue(sha3('dateAdded', id));
        dateIssued = bookStore.getIntValue(sha3('dateIssued', id));
        totalRating = bookStore.getIntValue(sha3('totalRating', id));
        reviewersCount = bookStore.getIntValue(sha3('reviewersCount', id));
    }

    function borrowBook(address bookStoreAddress, uint id) {
        var bookStore = DataStore(bookStoreAddress);
        // Can't borrow book if passed value is not sufficient
        if (msg.value < 10**12) {
            Status(123);
            return;
        }
        // Can't borrow a non-existent book
        if (id > bookStore.count() || bookStore.getIntValue(sha3('state', id)) != 0) {
            Status(124);
            return;
        }
        // 50% value is shared with the owner
        var ownerShare = msg.value/2;
        if (!bookStore.getAddressValue(sha3('owner', id)).send(ownerShare)) {
            Status(125);
            return;
        }

        bookStore.setAddressValue(sha3('borrower', id), msg.sender);
        bookStore.setIntValue(sha3('dateIssued', id), now);
        bookStore.setIntValue(sha3('state', id), 1);
        bookStore.triggerEvent("borrow", id, msg.sender, "", 0);
    }

    function returnBook(address bookStoreAddress, uint id) {
        var bookStore = DataStore(bookStoreAddress);
        if (id > bookStore.count() || bookStore.getIntValue(sha3('state', id)) == 0 || bookStore.getAddressValue(sha3('owner', id)) != msg.sender) {
            Status(126);
            return;
        }
        address borrower = bookStore.getAddressValue(sha3('borrower', id));
        bookStore.setAddressValue(sha3('borrower', id), 0x0);
        bookStore.setIntValue(sha3('dateIssued', id), 0);
        bookStore.setIntValue(sha3('state', id), 0);
        bookStore.triggerEvent("return", id, borrower, "", 0);
    }

    function rateBook(address bookStoreAddress, uint id, uint rating, uint oldRating, string comments) {
        var bookStore = DataStore(bookStoreAddress);
        if (id > bookStore.count() || rating < 1 || rating > 5) {
            Status(127);
            return;
        }
        if (oldRating == 0) {
            bookStore.setIntValue(sha3('reviewersCount', id), bookStore.getIntValue(sha3('reviewersCount', id)) + 1);
            bookStore.setIntValue(sha3('totalRating', id), bookStore.getIntValue(sha3('totalRating', id)) + rating);
        } else {
            bookStore.setIntValue(
                sha3('totalRating', id),
                bookStore.getIntValue(sha3('totalRating', id)) + rating - oldRating
            );
        }
        bookStore.triggerEvent("rate", id, msg.sender, comments, rating);
        // All reviews are logged. Applications are responsible for eliminating duplicate ratings
        // and computing average rating.
    }
}
