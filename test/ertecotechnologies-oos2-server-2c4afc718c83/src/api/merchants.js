const Router = require('koa-router')
const { hasRoleMiddleware } = require('./auth_helpers')
const { Merchant: Model } = require('../models')

const router = Router()

// ONLY ADMINS
router.use(hasRoleMiddleware('admin'))

router.param('id', async (id, ctx, next) => {
  ctx.state.record = await Model.findById(id)
  if (ctx.state.record) {
    await next()
  } else {
    ctx.throw(404, 'Record not found')
  }
})

// COLLECTION
router.get('/', async (ctx) => {
  const params = {
    pageNo: 1,
    pageSize: 20,
    orderBy: 'id',
    orderDir: 'ASC',
    ...ctx.query
  }
  params.pageNo = parseInt(params.pageNo) - 1
  params.pageSize = parseInt(params.pageSize)

  const query = {
    where: {},
    offset: params.pageNo * params.pageSize,
    limit: params.pageSize,
    order: [[params.orderBy, params.orderDir]],
    raw: true
  }

  const [totalCount, {count: filteredCount, rows: records}] = await Promise.all([
    Model.count(),
    Model.findAndCountAll(query)
  ])

  ctx.body = { totalCount, filteredCount, records }
})

// GET
router.get('/:id', async (ctx) => {
  ctx.body = ctx.state.record
})

// CREATE
router.post('/', async (ctx) => {
  ctx.body = await Model.create(ctx.request.body.record)
})

// UPDATE
router.put('/:id', async (ctx) => {
  ctx.body = await ctx.state.record.update(ctx.request.body.record)
})

// DELETE
router.delete('/:id', async (ctx) => {
  ctx.body = await ctx.state.record.destroy()
})

module.exports = router
