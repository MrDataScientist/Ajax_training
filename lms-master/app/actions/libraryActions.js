import actionType from './actionTypes'
import { sessionService } from 'redux-react-session'
import axios from 'axios'
import apiList from './api.list'
import NotificationType from '../components/notifications/NotificationTypes'

export const action = (type, flag) => {
  return {
    type: type,
    payload: flag
  }
}

export const isSuccess = (response) => {
  return !(response.logs.length && response.logs[0].event === 'Status')
}

export const getAccounts = () => {
  return (dispatch) => {
    dispatch(action(actionType.GET_ACCOUNTS_LOADING, true))
    axios.get(apiList.getAccounts)
    .then((result) => {
      if(result.data.status){
        dispatch(action(actionType.GET_ACCOUNTS_SUCCESS, result.data.accs))
      }else{
        console.log("Error Occured", result.data.logs)
        dispatch(action(actionType.GET_ACCOUNTS_ERROR, NotificationType('error', 'Error', result.data.logs)))
      }
    }).catch((err) => {
      console.log("Error Occured", err);
      dispatch(action(actionType.GET_ACCOUNTS_ERROR, NotificationType('error', 'Error', err.message)))
    })
    .then(() => {
      dispatch(action(actionType.GET_ACCOUNTS_LOADING, false))
    })
  }
}

export const getBalance = (ownerDetails) => {
  return (dispatch) => {
    dispatch(action(actionType.GET_USER_BALANCE_LOADING, true))
    const data = {
      ownerDetails
    }
    axios.post(apiList.getBalance, data)
      .then((result) => {
        if(result.data.status){
          dispatch(action(actionType.GET_USER_BALANCE_SUCCESS, result.data.balance))
        }else{
          dispatch(action(actionType.GET_USER_BALANCE_ERROR, NotificationType('error', 'Error', result.data.logs)))
        }
        dispatch(action(actionType.GET_USER_BALANCE_LOADING, false))
      })
      .catch((err) => {
        console.log("Error Occured", err)
      });
  }
}

export const getOwnerDetails = (response) => {
  return (dispatch) => {
    dispatch(action(actionType.GET_OWNERDETAILS_LOADING, true))
    axios.post(apiList.ownerDetails)
    .then((result) => {
      if(result.data.status){
        login(response, result.data.user)
        console.log("owner details", result.data.user);
        dispatch(action(actionType.GET_OWNERDETAILS_SUCCESS, result.data.user))
        dispatch(action(actionType.GET_OWNERDETAILS_LOADING, false))
      }else{
        console.log("Error Occured", result.data.logs)
        dispatch(action(actionType.GET_OWNERDETAILS_ERROR, NotificationType('error', 'Error', result.data.logs)))
        dispatch(action(actionType.GET_OWNERDETAILS_LOADING, false))
      }
    })
    .catch((e) => {
      console.log("Error Occured", e)
      dispatch(action(actionType.GET_OWNERDETAILS_ERROR, NotificationType('error', 'Error', e.message)))
      dispatch(action(actionType.GET_OWNERDETAILS_LOADING, false))
    })
  }
}

export const getAllBooks = () => {
  return (dispatch) => {
    dispatch(action(actionType.GET_ALL_BOOKS_LOADING, true))
    axios.get(apiList.books)
    .then((books) => {
      dispatch(action(actionType.GET_ALL_BOOKS_SUCCESS, books.data.result))
      dispatch(action(actionType.GET_ALL_BOOKS_LOADING, false))
    }).catch((e) => {
      console.log("Error Occured", e)
      dispatch(action(actionType.GET_ALL_BOOKS_ERROR, NotificationType('error', 'Error', e.message)))
      dispatch(action(actionType.GET_ALL_BOOKS_LOADING, false))
    })
  }
}

export const getMyBooks = () => {
  return (dispatch) => {
    dispatch(action(actionType.GET_MY_BOOKS_LOADING, true))
    axios.get(apiList.myBooks)
    .then((books) => {
      dispatch(action(actionType.GET_MY_BOOKS_SUCCESS, books.data.result))
      dispatch(action(actionType.GET_MY_BOOKS_LOADING, false))
    }).catch((e) => {
      console.log("Error Occured", e)
      dispatch(action(actionType.GET_MY_BOOKS_ERROR, NotificationType('error', 'Error', e.message)))
      dispatch(action(actionType.GET_MY_BOOKS_LOADING, false))
    })
  }
}

export const addBook = (book) => {
  return (dispatch) => {
    dispatch(action(actionType.GET_ADD_BOOKS_LOADING, true))
    axios.post(apiList.addBook, book)
    .then((response) => {
      if(response.data.status) {
        dispatch(action(actionType.GET_ADD_BOOKS_SUCCESS, book))
        dispatch(getAllBooks())
      } else {
        dispatch(action(
          actionType.GET_ADD_BOOKS_ERROR,
          NotificationType('error', 'Error', response.data.logs)
        ))
      }
    }).catch((e) => {
      console.log("Error Occured", e)
      dispatch(action(actionType.GET_ADD_BOOKS_ERROR, NotificationType('error', 'Error', e.message)))
    }).then(() => {
      dispatch(action(actionType.GET_ADD_BOOKS_LOADING, false))
      dispatch(getBalance(book.owner))
    })
  }
}

export const updateBook = (bookId, book) => {
  return (dispatch) => {
    dispatch(action(actionType.UPDATE_BOOK_LOADING, true))
    const bookData = {
      bookId,
      book
    }
    axios.post(apiList.updateBook, bookData)
    .then((response) => {
      if(response.data.status) {
        dispatch(getAllBooks())
      } else {
        dispatch(action(
          actionType.UPDATE_BOOK_ERROR,
          NotificationType('error', 'Error', response.data.logs)
        ))
      }
    }).catch((e) => {
      console.log("Error Occured", e)
      dispatch(action(actionType.UPDATE_BOOK_ERROR, NotificationType('error', 'Error', e.message)))
    }).then(() => {
      dispatch(action(actionType.UPDATE_BOOK_LOADING, false))
      dispatch(getBalance(book.owner))
    })
  }
}

export const returnBook = (book) => {
  return (dispatch) => {
    dispatch(action(actionType.GET_RETURN_BOOKS_LOADING, true))
    axios.post(apiList.returnBook, book)
    .then((response) => {
      if(response.data.status) {
        dispatch(action(actionType.GET_RETURN_BOOKS_SUCCESS, book))
      } else {
          dispatch(action(
            actionType.GET_RETURN_BOOKS_ERROR,
            NotificationType('error', 'Error', response.data.logs)
          ))
      }
    }).catch((e) => {
      console.log("Error Occured", e)
      dispatch(action(actionType.GET_RETURN_BOOKS_ERROR, NotificationType('error', 'Error', e.message)))
    }).then(() => {
      dispatch(action(actionType.GET_RETURN_BOOKS_LOADING, false))
      dispatch(getBalance({ account: book.owner }))
    })
  }
}

export const borrowBook = (book, ownerDetails) => {
  return (dispatch) => {
    dispatch(action(actionType.GET_BORROW_BOOKS_LOADING, true))
    const bookBorrowData = {
      bookId: book.id,
      ownerDetails 
    }
    axios.post(apiList.borrowBook, bookBorrowData)
    .then((response) => {
      if(response.data.status) {
        dispatch(action(actionType.GET_BORROW_BOOKS_SUCCESS, { book, owner: ownerDetails.account }))
      } else {
          dispatch(action(
            actionType.GET_BORROW_BOOKS_ERROR,
            NotificationType('error', 'Error', response.data.logs)
          ))
      }
    }).catch((e) => {
      console.log("Error Occured", e)
      dispatch(action(actionType.GET_BORROW_BOOKS_ERROR, NotificationType('error', 'Error', e.message)))
    }).then(() => {
      dispatch(action(actionType.GET_BORROW_BOOKS_LOADING, false))
      dispatch(getBalance(ownerDetails))
    })
  }
}

export const searchBook = (book) => {
  return action(actionType.SEARCH_BOOK, book)
}

export const rateBook = (rating, comment, book, ownerDetails) => {
  return (dispatch) => {
    dispatch(action(actionType.RATE_BOOK_LOADING, true))
    const reviewers = book.reviewers || []
    const index = reviewers.indexOf(ownerDetails.account)
    const oldRating = (index === -1) ? 0 : book.ratings[index]
    const data = {
      bookId: book.id,
      rating,
      comment,
      oldRating,
      account: ownerDetails.account
    }
    axios.post(apiList.rateBook, data)
    .then((result) => {
      if(result.data.status) {
        dispatch(action(actionType.GET_RATE_BOOK_SUCCESS, {
          bookId: book.id,
          rating: rating,
          comments: comment,
          reviewer: ownerDetails.account,
          flag: true
        }))
      } else {
          dispatch(action(
            actionType.RATE_BOOK_ERROR,
            NotificationType('error', 'Error', result.data.logs[0].args.statusCode.c[0])
          ))
      }
    })
    .catch((e) => {
      console.log("Error Occured", e)
      dispatch(action(actionType.RATE_BOOK_ERROR, NotificationType('error', 'Error', e.message)))
    })
    .then(() => {
      dispatch(action(actionType.RATE_BOOK_LOADING, false))
      dispatch(getBalance(ownerDetails))
    })
  }
}

export const login = (response, userVal) => {
  return (dispatch) => {
    sessionService.saveSession(response)
    .then(() => {
      const user = {
        'name' : userVal[0],
        'account' : userVal[1],
        'email' : userVal[2]
      }
      sessionService.saveUser(user)
      dispatch(getBalance(user))
    }).catch(e => dispatch(action(actionType.LOGIN_ERROR, NotificationType('error', 'Error', e.message))))
  }
}

export const logout = () => {
  return (dispatch) => {
    sessionService.deleteSession()
    sessionService.deleteUser()
    axios.get(apiList.logout)
    .then((result) => {
      if(result.data.status){
      }
    })
    .catch((err) => {
      console.log(err)
    })
    /*if(window.gapi) {
        window.gapi.auth2.getAuthInstance().disconnect()
    }*/
    dispatch(action(actionType.LOGOUT,[]))
  }
}

export const getUserAuthStatus = () => {
  return (dispatch) => {
    axios.get(apiList.authUser)
    .then((result) => {
      if(result.data.auth_status){
        dispatch(getMemberDetailsByEmail(result.data))
      }else{
        dispatch(logout())
      }
    }).catch((err) => {
      console.log(err);
    })
  }
}

export const getMemberDetailsByEmail = (response, callbackFn, argsArr ) => {
  return (dispatch) => {
    dispatch(action(actionType.GET_MEMBER_DETAILS_EMAIL_LOADING, true))
    const data = {
      email : response.profileObj.email
    }
    axios.post(apiList.memberDetailsByEmail, data)
    .then((result) => {
      if(result.data.status){
        dispatch(action(actionType.GET_MEMBER_DETAILS_EMAIL_SUCCESS, { session: response, user : result.data.user, callbackFn, argsArr }))
      }else {
        dispatch(action(actionType.GET_MEMBER_DETAILS_EMAIL_ERROR, NotificationType('error', 'Error', result.data.logs)))
      }
    })
    .catch((e) => {
      console.log("Error Occured", e)
      dispatch(action(actionType.GET_MEMBER_DETAILS_EMAIL_ERROR, NotificationType('error', 'Error', e.message)))
    })
    .then(() => {
      dispatch(action(actionType.GET_MEMBER_DETAILS_EMAIL_LOADING, false))
    })
  }
}

export const getMemberDetailsByAccount = (account) => {
  return (dispatch) => {
    dispatch(action(actionType.GET_MEMBER_DETAILS_LOADING, true))
    axios.post(apiList.memberDetailsByAccount, account)
    .then((result) => {
      if(result.data.status){
        dispatch(action(actionType.GET_MEMBER_DETAILS_SUCCESS, result.data.user))
      }else {
        dispatch(action(actionType.GET_MEMBER_DETAILS_ERROR, NotificationType('error', 'Error', result.data.logs)))
      }
    })
    .catch((e) => {
      console.log("Error Occured", e)
      dispatch(action(actionType.GET_MEMBER_DETAILS_ERROR, NotificationType('error', 'Error', e.message)))
    })
    .then(() => {
      dispatch(action(actionType.GET_MEMBER_DETAILS_LOADING, false))
    })
  }
}

export const getAllMembers = () => {
  return (dispatch) => {
    dispatch(action(actionType.GET_ALL_MEMBERS_LOADING, true))
    axios.get(apiList.members)
    .then((result) => {
      if(result.data.status){
        dispatch(action(actionType.GET_ALL_MEMBERS_SUCCESS, result.data.users))
      }else {
        dispatch(action(actionType.GET_ALL_MEMBERS_ERROR, NotificationType('error', 'Error', result.data.logs)))
      }
    })
    .catch((e) => {
      console.log("Error Occured", e)
      dispatch(action(actionType.GET_ALL_MEMBERS_ERROR, NotificationType('error', 'Error', e.message)))
    })
    .then(() => {
      dispatch(action(actionType.GET_ALL_MEMBERS_LOADING, false))
    })
  }
}

export const getRatings = (result) => {
  return (dispatch) => {
    dispatch(action(actionType.GET_RATE_BOOK_LOADING, true))
    if(result.status){
      dispatch(action(actionType.GET_RATE_BOOK_SUCCESS, result.args))      
    }else{
      dispatch(action(actionType.GET_RATE_BOOK_ERROR, NotificationType('error', 'Error', result.logs)))
    }
    dispatch(action(actionType.GET_RATE_BOOK_LOADING, false))
  }
}

export const createAccount = (session) => {
  return (dispatch) => {
    dispatch(action(actionType.CREATE_ACCOUNT_LOADING, true))
    const data = {
      email: session.profileObj.email
    }
    return axios.post(apiList.createAccount, data)
            .then((response) => {
              const user = [
                session.profileObj.name,
                response.data.data.result,
                session.profileObj.email
              ];
              dispatch(unlockAccount(session, user, true))
            })
            .catch((e) => {
              console.log("Error Occured", e)
              dispatch(action(actionType.CREATE_ACCOUNT_ERROR, NotificationType('error', 'Error', e.message)))
            }).then(() => {
              dispatch(action(actionType.CREATE_ACCOUNT_LOADING, false))
            });
  };
}

export const addMember = (member) => {
  return (dispatch) => {
    dispatch(action(actionType.ADD_MEMBER_LOADING, true))
    axios.post(apiList.addMember, member)
    .then((result) => {
      console.log("result", result);
      if(result.data.status){
        dispatch(getAllMembers())
        dispatch(action(actionType.ADD_MEMBER_SUCCESS, true))
      }else{
        dispatch(action(
          actionType.ADD_MEMBER_ERROR,
          NotificationType('error', 'Error', result.data.logs)
        ))
      }
    })
    .catch((e) => {
      console.log("Error Occured", e)
      dispatch(action(actionType.ADD_MEMBER_ERROR, NotificationType('error', 'Error', e.message)))
    })
    .then(() => {
      dispatch(action(actionType.ADD_MEMBER_LOADING, false))
    })
  }
}

export const unlockAccount = (session, user, flag) => {
  return (dispatch) => {
    dispatch(action(actionType.UNLOCK_ACCOUNT_LOADING, true))
    const data = {
      user : user[1],
      email: user[2]
    }
    axios.post(apiList.unlockAccount, data)
    .then((result) => {
      dispatch(action(actionType.UNLOCK_ACCOUNT_LOADING, false))
      if(!result.data.status){
        dispatch(action(actionType.UNLOCK_ACCOUNT_ERROR, NotificationType('error', 'Error', result.data.logs)))
        return
      }
      if(flag) {
        dispatch(addMember(user))
      }
      dispatch(login(session, user))
    })
  }
}

export const shuffleAllBooks = (books) =>{
  return (dispatch) => {
    dispatch(action(actionType.SHUFFLE_ALL_BOOKS,books))
  }
}

export const borrowEvent = (bookId, result) => {
  return (dispatch) => {
    dispatch(action(actionType.BORROW_EVENT_LOADING, true))
    if(result && result.args.bookId == bookId){
      if(result.status){
        dispatch(action(actionType.BORROW_EVENT_SUCCESS, result.args))
      }else{
        console.log("Error Occured", result.logs)
        dispatch(action(actionType.BORROW_EVENT_ERROR, NotificationType('error', 'Error', result.logs)))
      }
    }
    dispatch(action(actionType.BORROW_EVENT_LOADING, false))
  }
}

export const returnEvent = (bookId, result) => {
  return (dispatch) => {
    dispatch(action(actionType.RETURN_EVENT_LOADING, true))
    if(result && result.args.bookId == bookId){
      if(result.status){
        dispatch(action(actionType.RETURN_EVENT_SUCCESS, result.args))
      }else{
        console.log("Error Occured", result.logs)
        dispatch(action(actionType.RETURN_EVENT_ERROR, NotificationType('error', 'Error', result.logs)))
      }
    }
    dispatch(action(actionType.RETURN_EVENT_LOADING, false))
  }
}
