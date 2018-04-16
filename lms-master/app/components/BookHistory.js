import React from 'react'
import { connect } from 'react-redux'
import * as libraryActions from '../actions/libraryActions'
import BookRecord from './utils/BookRecord'
import { socketConnect } from 'socket.io-react';

export const mapStateToProps = (state=[]) => {
  return {
    book_history: state.book_history
  }
}

export class BookHistory extends React.Component {
  componentDidMount () {
    this.props.socket.on('SOCKET_MSG_BORROW_EVENT_RECEIVE', result => {
      this.props.borrowEvent(this.props.book.id, result)
    });
    this.props.socket.on('SOCKET_MSG_RETURN_EVENT_RECEIVE', result => {
      this.props.returnEvent(this.props.book.id, result)
    });
    if(!this.props.book_history || !this.props.book_history.borrow_history[+this.props.book.id]) {
      this.props.socket.emit('SOCKET_MSG', {
        title: 'GET_BORROW_EVENT',
        bookId: this.props.book.id
      });
    }
    if(!this.props.book_history || !this.props.book_history.return_history[+this.props.book.id]) {
      this.props.socket.emit('SOCKET_MSG', {
        title: 'GET_RETURN_EVENT',
        bookId: this.props.book.id
      });
    }
  }
  render () {
    const borrow_history = this.props.book_history && this.props.book_history.borrow_history[+this.props.book.id]
    const return_history = this.props.book_history && this.props.book_history.return_history[+this.props.book.id]
    return (
      <div className='book-history'>
      {
        borrow_history !== undefined &&
        <BookRecord title='Borrowing History'
          tableHeading = {{ columnOne: 'Issued Date', columnTwo: 'Issued By' }}
          history={borrow_history}
          members={this.props.members} />
      }
      {
        return_history !== undefined &&
        <BookRecord title='Returing History'
          tableHeading = {{ columnOne: 'Return Date', columnTwo: 'Returned By' }}
          history={return_history}
          members={this.props.members} />
      }
      </div>
    )
  }
}

export default connect(mapStateToProps, libraryActions)(socketConnect(BookHistory))