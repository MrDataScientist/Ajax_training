/* global web3:true */

import { Sale } from '../../contracts'
import * as types from '../mutation-types'
import { getBalance, toEth } from '../../utils'

const statusEnum = {
  0: 'Created',
  1: 'Locked',
  2: 'Inactive'
}

const state = {
  account: '',
  address: '',
  buyer: '',
  seller: '',
  status: '',
  value: new web3.BigNumber(0),
  balance: '',
  events: []
}

const getters = {
  address: state => state.address,
  value: state => state.value,
  balance: state => state.balance,
  status: state => state.status,
  buyer: state => state.buyer,
  seller: state => state.seller,
  events: state => state.events
}

const actions = {
  createSale ({ commit, state }, { price, router }) {
    commit(types.UPDATE_LOADING, true)
    commit(types.UPDATE_LOADING_TEXT, 'Creating new sale contract...')
    const value = web3.toWei(price.times(2), 'ether')
    Sale.new({ from: state.account, value: value }).then((instance) => {
      // don't need to set loading to false here because it will happen in getSaleInfo
      router.push({ name: 'sale', params: { address: instance.address } })
    }).catch((err) => {
      alert(err)
      commit(types.UPDATE_LOADING, false)
    })
  },
  getSaleInfo ({ commit, dispatch, state }, router) {
    commit(types.UPDATE_LOADING, true)
    commit(types.UPDATE_LOADING_TEXT, 'Retrieving sale info...')
    try {
      Sale.at(state.address).then((instance) => {
        let sale = instance
        const from = { from: state.account }
        const promises = [
          sale.value.call(from),
          sale.state.call(from),
          sale.buyer.call(from),
          sale.seller.call(from),
          getBalance(state.address)
        ]

        Promise.all(promises).then((values) => {
          commit(types.UPDATE_VALUE, toEth(values[0]))
          commit(types.UPDATE_STATUS, statusEnum[values[1].toString()])
          commit(types.UPDATE_BUYER, values[2])
          commit(types.UPDATE_SELLER, values[3])
          commit(types.UPDATE_BALANCE, toEth(values[4]))
          commit(types.UPDATE_LOADING, false)
        }).catch((err) => {
          alert(err)
          commit(types.UPDATE_LOADING, false)
        })
      })
    } catch (err) {
      console.error(err)
      commit(types.UPDATE_LOADING, false)
      commit(types.UPDATE_ERROR, err.toString())
      router.push({ name: 'error' })
    }
  },
  abort ({ commit, dispatch, state }) {
    commit(types.UPDATE_LOADING, true)
    commit(types.UPDATE_LOADING_TEXT, 'Aborting sale...')
    Sale.at(state.address).then((instance) => {
      return instance.abort({ from: state.account })
    }).catch((err) => {
      alert(err)
      commit(types.UPDATE_LOADING, false)
    })
  },
  purchase ({ commit, dispatch, state }) {
    commit(types.UPDATE_LOADING, true)
    commit(types.UPDATE_LOADING_TEXT, 'Purchasing...')
    Sale.at(state.address).then((instance) => {
      const value = web3.toWei(state.value.times(2), 'ether')
      return instance.purchase({ from: state.account, value: value })
    }).catch((err) => {
      alert(err)
      commit(types.UPDATE_LOADING, false)
    })
  },
  confirm ({ commit, dispatch, state }) {
    commit(types.UPDATE_LOADING, true)
    commit(types.UPDATE_LOADING_TEXT, 'Confirming sale...')
    Sale.at(state.address).then((instance) => {
      return instance.confirm({ from: state.account })
    }).catch((err) => {
      alert(err)
      commit(types.UPDATE_LOADING, false)
    })
  }
}

const mutations = {
  [types.UPDATE_BALANCE] (state, balance) {
    state.balance = balance
  },
  [types.UPDATE_VALUE] (state, value) {
    state.value = value
  },
  [types.UPDATE_STATUS] (state, status) {
    state.status = status
  },
  [types.UPDATE_BUYER] (state, buyer) {
    state.buyer = buyer
  },
  [types.UPDATE_SELLER] (state, seller) {
    state.seller = seller
  },
  [types.NEW_EVENT] (state, event) {
    state.events = state.events.concat([event]).sort((a, b) => a.time.getTime() - b.time.getTime())
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
