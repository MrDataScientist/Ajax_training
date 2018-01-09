const Router = require('koa-router')
const { hasRole, hasRoleMiddleware } = require('./auth_helpers')
const { Order, Merchant, Product, Task, Submodule } = require('../models')

const router = Router()

// COLLECTION
router.get('/', async (ctx) => {
  const counts = await Order.count({
    attributes: ['state'],
    group: ['state'],
    raw: true
  })

  ctx.body = counts.reduce((obj, count) => {
    obj[count.state] = count.count
    return obj
  }, {})
})

module.exports = router
