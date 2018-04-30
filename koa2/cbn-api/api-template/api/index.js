const Router = require('koa-router')
const publicApi = require('./publicApi')
const auth = require('./auth')
const admins = require('./admins')
const merchants = require('./merchants')
const cbngateway = require('./cbngateway')

const api = Router({prefix: '/api'})

api.use(publicApi.routes())
api.use(auth.routes()) // auth is required from here on
api.use('/admins', admins.routes())
api.use('/merchants', merchants.routes())

api.use('/cbngateway', cbngateway.routes())


module.exports = api
