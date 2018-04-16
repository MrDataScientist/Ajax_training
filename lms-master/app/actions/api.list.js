// const baseAddress = 'http://localhost:8080/api/'
const baseAddress = '/api/'

const apiList = {
    createAccount:          baseAddress + 'auth/create_account', // Post Api
    members:                baseAddress + 'members', // Get Api
    getAccounts:            baseAddress + 'getaccounts', // Get Api
    addMember:              baseAddress + 'members/addmember', // Post Api
    // removemember:           baseAddress + 'members/removemember',
    unlockAccount:          baseAddress + 'members/unlockaccount', // Post Api
    memberDetailsByAccount: baseAddress + 'members/memberdetailsbyaccount', // Post Api
    memberDetailsByEmail:   baseAddress + 'members/memberdetailsbyemail', // Post Api
    // numberofmembers:        baseAddress + 'members/numberofmembers',
    ownerDetails:           baseAddress + 'members/ownerdetails',
    getBalance:             baseAddress + 'members/getbalance', // Post Api
    books:                  baseAddress + 'books/', // Get Api
    book:                   baseAddress + 'books/book', // Get Api
    myBooks:                baseAddress + 'books/mybooks', // Get Api
    addBook:                baseAddress + 'books/addbook', // Post Api
    updateBook:             baseAddress + 'books/updatebook', // Post Api
    borrowBook:             baseAddress + 'books/borrowbook', // Post Api
    returnBook:             baseAddress + 'books/returnbook', // Post Api
    rateBook:               baseAddress + 'books/ratebook',
    getRatings:             baseAddress + 'books/getRatings', // Get Api
    // searchBook:             baseAddress + 'books/searchbook',
    authUser:               '/account/',
    logout:                 '/logout/'
}

export default apiList;