import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import App from './App'
import BooksPage from './BooksPage'
import RequestAuthentication from './RequestAuthentication'
import { connect } from 'react-redux'
import { SocketProvider } from 'socket.io-react';
import io from 'socket.io-client';

const socket = io.connect(window.location.origin);

const Main = ({ checked }) => (
  checked &&
  <SocketProvider socket={socket}>
    <Switch>
      <Route path='/books' component={RequestAuthentication(App)} />
      <Route path='/' component={BooksPage} />
    </Switch>
  </SocketProvider>
)

const mapStateToProps = (state) => {
  return {
    checked: state.session.checked
  }
}

export default withRouter(connect(mapStateToProps)(Main))
