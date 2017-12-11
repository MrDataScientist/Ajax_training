import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import sale from './modules/sale'
import * as types from './mutation-types'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const rootState = {
  account: '',
  loading: false,
  loadingText: '',
  error: ''
}

const getters = {
  account: state => state.account,
  loading: state => state.loading,
  loadingText: state => state.loadingText,
  error: state => state.error
}

const actions = {
  // action is dispatched when account is first set
  // this is where you can put your initialization calls
  setAccount ({ commit, dispatch, state }, { account, router }) {
    commit(types.UPDATE_ACCOUNT, account)
  },
  // action is dispatched when/if the account is updated
  // use this action to refresh the app with the new account's data
  updateAccount ({ commit, dispatch, state }, { account, router }) {
    commit(types.UPDATE_ACCOUNT, account)
  }
}

const mutations = {
  [types.ROUTE_CHANGED] (state, { to, from }) {
    if (to.name === 'sale' && (from.name !== 'sale' || from.params.address !== to.params.address)) {
      state.sale.address = to.params.address
      state.sale.events = []
    }
  },
  [types.UPDATE_ACCOUNT] (state, account) {
    state.account = account
    state.sale.account = account
  },
  [types.UPDATE_LOADING] (state, loading) {
    state.loading = loading
  },
  [types.UPDATE_LOADING_TEXT] (state, loadingText) {
    state.loadingText = loadingText
  },
  [types.UPDATE_ERROR] (state, error) {
    state.error = error
  }
}

export default new Vuex.Store({
  state: rootState,
  getters,
  actions,
  mutations,
  modules: {
    sale
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
