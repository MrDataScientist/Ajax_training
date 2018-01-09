import 'element-ui/lib/theme-chalk/index.css'

import locale from 'element-ui/lib/locale/lang/en'

import Vue from 'vue'
import VueRouter from 'vue-router'
import VueAxios from 'vue-axios'
import VueAuth from '@websanova/vue-auth'
import ElementUI from 'element-ui'
import axios from 'axios'
import dateFnsFormat from 'date-fns/format'
import config from './config'
import routes from './routes'
import App from './App'

Vue.config.productionTip = false

const router = Vue.router = new VueRouter({
  routes,
  mode: 'history',
  linkActiveClass: 'active'
})

Vue.use(VueRouter)
Vue.use(VueAxios, axios)
Vue.use(ElementUI, {locale, size: 'small' })
Vue.use(VueAuth, {
  tokenName: 'token',
  fetchData: {url: '/auth/user', redirect: '/'},
  loginData: {url: '/auth/login'},
  refreshData: {enabled: false},
  auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
  http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js')
})

Vue.axios.defaults.baseURL = '/api/'
Vue.axios.defaults.responseType = 'json'
Vue.axios.defaults.headers.Accept = 'application/json'
// Vue.axios.interceptors.response.use(function (response) {
//   return response
// }, function (err) {
//   console.log(err)
//   Vue.prototype.$notify.error(err)
//   return Promise.reject(err)
// })

Vue.filter('formatDate', (value, format = 'YYYY.MM.DD HH:mm:ss') => {
  return dateFnsFormat(value, format, {})
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
