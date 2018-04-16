import React from 'react'
import { shallow } from 'enzyme'
import { BooksPage, mapStateToProps } from '../../../components/BooksPage'
import Header from '../../../components/Header'
import Loader from '../../../components/Loader'
import LMSAuth from '../../../components/LMSAuth'

describe('BooksPage',() => {
  let component, props;
  beforeEach(() => {
    props = {
      books: {
        allBooks: []
      },
      ownerDetails: {},
      filteredBooks: [],
      loading: {
        loginLoader: true
      },
      session: {
        authenticated: true,
        user: {
          account: '0x1'
        }
      },
      error: null,
      isExistingMember: {},
      accounts: null,
      getAllBooks: jest.fn(),
      getAllMembers: jest.fn(),
      getUserAuthStatus: jest.fn(),
      shuffleAllBooks: jest.fn(),
      getBalance: jest.fn(),
      getMemberDetailsByEmail: jest.fn(),
      logout: jest.fn(),
      createAccount: jest.fn(),
      unlockAccount: jest.fn(),
      history: [],
      socket: {
        on: jest.fn(),
        emit: jest.fn()
      }
    }
    component = shallow(<BooksPage {...props} />)
  })
  it('mapStateToProps',() => {
    const state = {
      books: {
        allBooks: []
      },
      session: {
        user : {}
      },
      filteredBooks: [],
      loading: {},
      error: null,
      isExistingMember: {},
      accounts: {}
    }
    expect(mapStateToProps(state)).toEqual({
      books: {
        allBooks: []
      },
      ownerDetails: {},
      filteredBooks: [],
      loading: {},
      session: { user: {} },
      error: null,
      isExistingMember: {},
      accounts: {}
    })
  })
  describe('componentDidMount',() => {
    describe('initial',() => {
      beforeEach(() => {
        document.body.innerHTML = '<div id="loader"></div>'
        component.instance().componentDidMount()
      })
      it('should hide loader',() => {
        const loader = document.getElementById('loader')
        expect(loader.style.display).toBe('none')
      })
      it('should call getAllBooks if no books present',() => {
        expect(props.getAllBooks.mock.calls.length).toBe(1)
      })
      it('should call shuffleAllBooks',() => {
        expect(props.shuffleAllBooks.mock.calls.length).toBe(1)
      })
      it('should call getAllMembers if account is empty',() => {
        expect(props.getAllMembers.mock.calls.length).toBe(1)
      })
      it('should call getUserAuthStatus to get user authentication status',() => {
        expect(props.getUserAuthStatus.mock.calls.length).toBe(1)
      })
    })
    describe('after load',() => {
      beforeEach(() => {
        props.books.allBooks.push({ title: 'Book' })
        props.accounts = {}
        component = shallow(<BooksPage {...props} />)
        document.body.innerHTML = '<div id="no-loader"></div>'
        const loader = document.getElementById('loader')
        component.instance().componentDidMount()
      })
      it('should not call getAllBooks if books are available',() => {
        expect(props.getAllBooks.mock.calls.length).toBe(0)
      })
      it('should not call getAllMembers if account is not empty',() => {
        expect(props.getAllMembers.mock.calls.length).toBe(0)
      })
    })
  })
  describe('componentWillReceiveProps',() => {
    describe('Balance',() => {
      it('should retreive balance if user is authenticated and has no balance',() => {
        component.instance().componentWillReceiveProps(props)
        expect(props.getBalance.mock.calls.length).toBe(1)
      })
      it('should not retreive balance if user is not authenticated',() => {
        props.session.authenticated = false
        component = shallow(<BooksPage {...props} />)
        component.instance().componentWillReceiveProps(props)
        expect(props.getBalance.mock.calls.length).toBe(0)
      })
      it('should not retreive balance if user already has balance',() => {
        props.accounts = { balance: '0' }
        component = shallow(<BooksPage {...props} />)
        component.instance().componentWillReceiveProps(props)
        expect(props.getBalance.mock.calls.length).toBe(0)
      })
    })
  })
  describe('Header',() => {
    it('should have a Header component', () => {
      expect(component.find(Header).exists()).toBe(true)
    })
    it('should call getMemberDetailsByEmail on successfull login', () => {
      component.find(Header).props().loginSuccess()
      expect(props.getMemberDetailsByEmail.mock.calls.length).toBe(1)
    })
    it('should not call getMemberDetailsByEmail on login failure', () => {
      component.find(Header).props().loginFailure()
      expect(props.getMemberDetailsByEmail.mock.calls.length).toBe(0)
    })
    it('should call logout', () => {
      component.find(Header).props().logout()
      expect(props.logout.mock.calls.length).toBe(1)
    })
  })
  describe('renderLoader', () => {
    it('should show loader with text "Validating User"',() => {
      expect(component.find(Loader).props().text).toBe('Validating User')
    })
    it('should show loader with text "Creating Account"',() => {
      props.loading.loginLoader = false
      props.loading.createAccountLoader = true
      component = shallow(<BooksPage {...props} />)
      expect(component.find(Loader).props().text).toBe('Creating Account')
    })
    it('should show loader with text "Creating Account"',() => {
      props.loading.loginLoader = false
      props.loading.addMemberLoader = true
      component = shallow(<BooksPage {...props} />)
      expect(component.find(Loader).props().text).toBe('Creating Account')
    })
    it('should show loader with text "Returning Book"',() => {
      props.loading.loginLoader = false
      props.loading.borrowBooksLoading = true
      component = shallow(<BooksPage {...props} />)
      expect(component.find(Loader).props().text).toBe('Borrowing book')
    })
    it('should show loader with text "Submitting Rating"',() => {
      props.loading.loginLoader = false
      props.loading.rateBookLoading = true
      component = shallow(<BooksPage {...props} />)
      expect(component.find(Loader).props().text).toBe('Submitting Rating')
    })
    it('should not show a loader',() => {
      props.loading.loginLoader = false
      component = shallow(<BooksPage {...props} />)
      expect(component.find(Loader).exists()).toEqual(false)
    })
    it('should show loader with text "Loading Books"',() => {
      props.loading.loginLoader = false
      props.loading.allbooksloading = true
      component = shallow(<BooksPage {...props} />)
      expect(component.find(Loader).props().text).toBe('Loading Books')
    })
    it('should show loader with text "Updating Book"',() => {
      props.loading.loginLoader = false
      props.loading.addBooksLoading = true
      component = shallow(<BooksPage {...props} />)
      expect(component.find(Loader).props().text).toBe('Updating Book')
    })
  })
})
