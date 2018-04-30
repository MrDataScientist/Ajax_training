const Router = require('koa-router')
const { Admin: Model, Sequelize } = require('../models')
const { checkRole, checkRoleMiddleware } = require('./auth_helpers')
const Op = Sequelize.Op

const router = Router()

// router.use(checkRoleMiddleware('admin'))

router.param('id', async (id, ctx, next) => {
  if (checkRole(ctx.state.user, 'admin') || ctx.state.user.id === parseInt(id)) {
    ctx.state.record = await Model.findById(id, { attributes: ['id', 'name', 'username', 'roles'] })
    if (ctx.state.record) {
      await next()
    } else {
      ctx.throw(404, 'Record not found')
    }
  } else {
    ctx.throw(401, 'No permissions')
  }
})

// COLLECTION
router.get('/', checkRoleMiddleware('admin'), async (ctx, next) => {
  const params = {
    orderBy: 'name',
    orderDir: 'asc',
    pageNo: 1,
    pageSize: 20,
    ...ctx.request.query
  }
  params.pageNo = parseInt(params.pageNo) - 1
  params.pageSize = parseInt(params.pageSize)

  const query = {
    attributes: ['id', 'name', 'username', 'roles', 'createdAt', 'updatedAt'],
    where: {},
    offset: params.pageNo * params.pageSize,
    limit: params.pageSize,
    order: [[params.orderBy, params.orderDir]]
  }

  if (params.name) {
    query.where.name = {[Op.iLike]: `%${params.name}%`}
  }

  const [totalCount, {count: filteredCount, rows: records}] = await Promise.all([
    Model.count(),
    Model.findAndCountAll(query)
  ])

  ctx.body = { totalCount, filteredCount, records }
})

// GET
router.get('/:id', async (ctx, next) => {
  ctx.body = ctx.state.record
})

// CREATE
router.post('/', checkRoleMiddleware('admin'), async (ctx, next) => {
  ctx.body = await Model.create(ctx.request.body.record)
})

// UPDATE
router.put('/:id', async (ctx, next) => {
  let body = ctx.request.body.record

  if (!checkRole(ctx.state.user, 'admin')) {
    ctx.request.body.record.roles = ctx.state.record.roles
  }

  if (!body.passwordChange || !body.password) {
    delete body.password
  }

  ctx.body = await ctx.state.record.update(body)
})

// DELETE
router.delete('/:id', checkRoleMiddleware('admin'), async (ctx, next) => {
  ctx.body = await ctx.state.record.destroy()
})

module.exports = router
