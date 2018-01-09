import Login from '@/components/Login.vue'

import Dashboard from '@/components/dashboard/Dashboard.vue'

import OrderList from '@/components/orders/OrderList.vue'
import OrderJson from '@/components/orders/OrderJson.vue'
import OrderLogs from '@/components/orders/OrderLogs.vue'
import OrderTasks from '@/components/orders/OrderTasks.vue'

import MerchantList from '@/components/merchants/MerchantList.vue'
import MerchantForm from '@/components/merchants/MerchantForm.vue'

import ProductList from '@/components/products/ProductList.vue'
import ProductForm from '@/components/products/ProductForm.vue'
import ProductTaskList from '@/components/products/ProductTaskList.vue'
import ProductTaskForm from '@/components/products/ProductTaskForm.vue'
import ProductTaskBlockers from '@/components/products/ProductTaskBlockers.vue'

import PluginList from '@/components/plugins/PluginList.vue'
import PluginForm from '@/components/plugins/PluginForm.vue'
import PluginInstanceForm from '@/components/plugins/PluginInstanceForm.vue'

import LogList from '@/components/logs/LogList.vue'

import UnknownOrderList from '@/components/unknownorders/UnknownOrderList.vue'
import UnknownOrderJson from '@/components/unknownorders/UnknownOrderJson.vue'

import Reports from '@/components/reports/Reports.vue'

export default [
  {
    path: '/login',
    component: Login,
    meta: {auth: false}
  },
  {
    path: '/',
    component: Dashboard,
    meta: {auth: true}
  },
  {
    path: '/orders',
    component: OrderList,
    meta: {auth: true},
    children: [
      {
        path: ':id/json',
        component: OrderJson
      },
      {
        path: ':id/logs',
        component: OrderLogs
      },
      {
        path: ':id/tasks',
        component: OrderTasks
      }
    ]
  },
  {
    path: '/merchants',
    component: MerchantList,
    meta: {auth: ['admin']},
    children: [
      {
        path: ':id',
        component: MerchantForm
      }
    ]
  },
  {
    path: '/products',
    component: ProductList,
    meta: {auth: ['admin']},
    children: [
      {
        path: ':id',
        component: ProductForm
      }
    ]
  },
  {
    path: '/products/:id/tasks',
    component: ProductTaskList,
    meta: {auth: ['admin']},
    children: [
      {
        path: ':taskId',
        component: ProductTaskForm
      },
      {
        path: ':taskId/blockers',
        component: ProductTaskBlockers
      }
    ]
  },
  {
    path: '/plugins',
    component: PluginList,
    meta: {auth: ['admin']},
    children: [
      {
        path: ':id/instances/:instanceId',
        component: PluginInstanceForm
      },
      {
        path: ':id',
        component: PluginForm
      }
    ]
  },
  {
    path: '/logs',
    component: LogList,
    meta: {auth: ['admin']}
  },
  {
    path: '/unknown-orders',
    component: UnknownOrderList,
    meta: {auth: ['admin']},
    children: [
      {
        path: ':id',
        component: UnknownOrderJson
      }
    ]
  },
  {
    path: '/reports',
    component: Reports,
    meta: {auth: ['admin', 'viewer']},
  }
]
