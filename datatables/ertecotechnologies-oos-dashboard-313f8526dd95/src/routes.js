import Login from '@/components/Login.vue'

import Dashboard from '@/components/dashboard/Dashboard.vue'

import OrderList from '@/components/orders/OrderList.vue'
import OrderJson from '@/components/orders/OrderJson.vue'
import OrderLogs from '@/components/orders/OrderLogs.vue'
import OrderTasks from '@/components/orders/OrderTasks.vue'

import MerchantList from '@/components/merchants/MerchantList.vue'
import MerchantForm from '@/components/merchants/MerchantForm.vue'

import SubmoduleList from '@/components/submodules/SubmoduleList.vue'
import SubmoduleForm from '@/components/submodules/SubmoduleForm.vue'

import ProductList from '@/components/products/ProductList.vue'
import ProductForm from '@/components/products/ProductForm.vue'
import ProductWorkflow from '@/components/products/ProductWorkflow.vue'
import ProductWorkflowValues from '@/components/products/ProductWorkflowValues.vue'

import PluginList from '@/components/plugins/PluginList.vue'
import PluginForm from '@/components/plugins/PluginForm.vue'
import PluginInstances from '@/components/plugins/PluginInstances.vue'

import LogList from '@/components/logs/LogList.vue'

import OrderPartList from '@/components/orderparts/OrderPartList.vue'
import OrderPartForm from '@/components/orderparts/OrderPartForm.vue'

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
    path: '/submodules',
    component: SubmoduleList,
    meta: {auth: ['admin']},
    children: [
      {
        path: ':id',
        component: SubmoduleForm
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
    path: '/products/:id/workflows',
    component: ProductWorkflow,
    meta: {auth: ['admin']},
    children: [
      {
        path: ':workflowId/values',
        component: ProductWorkflowValues
      }
    ]
  },
  {
    path: '/plugins',
    component: PluginList,
    meta: {auth: ['admin']},
    children: [
      {
        path: ':id/instances',
        component: PluginInstances
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
    path: '/order-parts',
    component: OrderPartList,
    meta: {auth: ['admin']},
    children: [
      {
        path: ':id',
        component: OrderPartForm
      }
    ]
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
