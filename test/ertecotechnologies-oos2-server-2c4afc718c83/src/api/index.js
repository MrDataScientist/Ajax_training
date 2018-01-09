const Router = require('koa-router')
const publicApi = require('./publicApi')
const auth = require('./auth')
const dashboard = require('./dashboard')
const orders = require('./orders')
const merchants = require('./merchants')
const products = require('./products')
const plugins = require('./plugins')
const logs = require('./logs')
const unknownOrders = require('./unknownOrders')
const reports = require('./reports')

const api = Router({prefix: '/api'})

api.use(publicApi.routes())
api.use(auth.routes()) // auth is required from here on
api.use('/dashboard', dashboard.routes())
api.use('/orders', orders.routes())
api.use('/merchants', merchants.routes())
api.use('/products', products.routes())
api.use('/plugins', plugins.routes())
api.use('/logs', logs.routes())
api.use('/unknown-orders', unknownOrders.routes())
api.use('/reports', reports.routes())

module.exports = api
