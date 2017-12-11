import Vue from 'vue'
import Router from 'vue-router'
import SafePay from '@/components/SafePay'
import Sale from '@/components/Sale'
import Error from '@/components/Error'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: SafePay
    },
    {
      path: '/sale/:address',
      name: 'sale',
      component: Sale
    },
    {
      path: '/error',
      name: 'error',
      component: Error
    }
  ]
})
