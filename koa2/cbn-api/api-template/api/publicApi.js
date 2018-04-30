const Router = require('koa-router')

const router = Router()

// PUBLIC
router.get('/some-public-api', async (ctx) => {
  // ctx.assert(ctx.query.test === 'test', 404, 'Needed parameter test=test')
  ctx.body = 'Works'
})

module.exports = router
