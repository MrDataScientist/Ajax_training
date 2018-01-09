const Router = require('koa-router')
const { hasRoleMiddleware } = require('./auth_helpers')
const { Product: Model, ProductTask, Plugin, Sequelize } = require('../models')
const Op = Sequelize.Op

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

router.param('taskId', async (taskId, ctx, next) => {
  ctx.state.task = await ProductTask.findById(taskId)
  if (ctx.state.task) {
    await next()
  } else {
    ctx.throw(404, 'Record not found')
  }
})

// COLLECTION
router.get('/', async (ctx, next) => {
  const params = {
    pageNo: 1,
    pageSize: 20,
    orderBy: 'name',
    orderDir: 'ASC',
    ...ctx.query
  }
  params.pageNo = parseInt(params.pageNo) - 1
  params.pageSize = parseInt(params.pageSize)

  const query = {
    where: {},
    offset: params.pageNo * params.pageSize,
    limit: params.pageSize,
    order: [[params.orderBy, params.orderDir]]
    // distinct: true
  }

  if (params.search) {
    query.where[Op.or] = [
      {name: {[Op.like]: `%${params.search}%`}},
      {token: {[Op.like]: `%${params.search}%`}},
      {description: {[Op.like]: `%${params.search}%`}}
    ]
  }

  const [totalCount, { count: filteredCount, rows: records }] = await Promise.all([
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
router.post('/', async (ctx, next) => {
  ctx.body = await Model.create(ctx.request.body.record)
})

// UPDATE
router.put('/:id', async (ctx, next) => {
  ctx.body = await ctx.state.record.update(ctx.request.body.record)
})

// DELETE
router.delete('/:id', async (ctx, next) => {
  ctx.body = await ctx.state.record.destroy()
})

// PRODUCT TASKS /////////////////////////////////////

// GET TASKS
router.get('/:id/tasks', async (ctx, next) => {
  ctx.body = await ctx.state.record.getProductTasks({
    include: [Plugin]
  })
})

// UPDATE TASKS ORDER
router.put('/:id/tasks', async (ctx, next) => {
  ctx.body = await Promise.all(ctx.request.body.tasks.map(task => {
    return ProductTask.update({
      priority: task.priority,
      blockers: task.blockers
    }, {
      where: {
        id: task.id
      }
    })
  }))
})

// GET TASK
router.get('/:id/tasks/:taskId', async (ctx, next) => {
  ctx.body = await ctx.state.task
})

// CREATE TASK
router.post('/:id/tasks', async (ctx, next) => {
  const tasks = await ctx.state.record.getProductTasks()
  const lastTask = tasks.length ? tasks[tasks.length - 1] : null
  ctx.request.body.record.ProductId = ctx.state.record.id
  ctx.request.body.record.priority = lastTask ? lastTask.priority + 1 : 1
  ctx.body = await ProductTask.create(ctx.request.body.record)
})

// UPDATE TASK
router.put('/:id/tasks/:taskId', async (ctx, next) => {
  ctx.body = await ctx.state.task.update(ctx.request.body.record)
})

// DELETE TASK
router.delete('/:id/tasks/:taskId', async (ctx, next) => {
  ctx.body = await ctx.state.task.destroy()
})

module.exports = router
