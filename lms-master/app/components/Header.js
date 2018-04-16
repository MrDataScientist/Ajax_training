import React from 'react'
import OwnerDetails from './OwnerDetails'
import GoogleLogin from 'react-google-login'
import { NavLink } from 'react-router-dom'
import LogoImg from '../img/logo_pramati_trans_152.png'

const Header = ({ loginSuccess, loginFailure, session, accounts, logout, authUser }) => (
  <nav className='navbar'>
    <div className='container-fluid'>
      <div className='navbar-header'>
        <a href='http://www.pramati.com/' className='navbar-brand'>
          <img className = 'logo logo-light'
          alt = 'Pramati Technologies'
          src = {LogoImg} />
        </a>
        <span className='navbar-brand'>
          Bookshelf
        </span>
      </div>
      <div id='navbar' className='navbar-collapse collapse navbar-right'>
        <ul className='nav navbar-nav'>
          <li>
            <NavLink exact to='/' activeClassName='active'>Home</NavLink>
          </li>
          <li className={(session.authenticated ? '' : 'hide')}>
            <NavLink exact to='/books' activeClassName='active'>Dashboard</NavLink>
          </li>
        </ul>
        {
          session.authenticated
            ? <OwnerDetails data={session.user} logout={() => logout()} accounts={accounts} />
            : <a href='auth/google' className='btn btn-default'>
                <span className='glyphicon glyphicon glyphicon-user'></span>&nbsp;&nbsp;
                <strong>Login</strong>
              </a>
        }
      </div>
    </div>
  </nav>
)

export default Header
