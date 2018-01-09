const Router = require('koa-router')
const { hasRoleMiddleware } = require('./auth_helpers')
const { Order: Model, Merchant, Product, Plugin, Workflow, WorkflowTask, Sequelize } = require('../models')
const Op = Sequelize.Op

const router = Router()

router.param('id', async (id, ctx, next) => {
  ctx.state.record = await Model.findById(id, {
    include: {
      model: Workflow,
      as: 'CurrentWorkflow'
    }
  })
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
    orderBy: 'CreatedAt',
    orderDir: 'ASC',
    ...ctx.query
  }
  params.pageNo = parseInt(params.pageNo) - 1
  params.pageSize = parseInt(params.pageSize)

  const query = {
    where: {},
    offset: params.pageNo * params.pageSize,
    limit: params.pageSize,
    order: [[params.orderBy, params.orderDir], ['id', 'desc']],
    distinct: true,
    // logging: console.log,
    include: [{
      model: Merchant
    }, {
      model: Product
    }, {
      model: Workflow,
      as: 'CurrentWorkflow',
      include: [{
        model: WorkflowTask,
        include: [Plugin]
      }]
    }]
  }

  if (params.state) {
    query.where.state = {[Op.in]: params.state}
  }

  if (params.id) {
    query.where.id = {[Op.like]: `${params.id}%`}
  }

  const [totalCount, {count: filteredCount, rows: records}] = await Promise.all([
    Model.count(),
    Model.findAndCountAll(query)
  ])

  ctx.body = { totalCount, filteredCount, records }
})

// GET
router.get('/:id', hasRoleMiddleware('admin'), async (ctx) => {
  ctx.body = ctx.state.record
})

// CREATE
router.post('/', hasRoleMiddleware('admin'), async (ctx) => {
  ctx.body = await Model.create(ctx.request.body.record)
})

// UPDATE
router.put('/:id', hasRoleMiddleware('admin'), async (ctx) => {
  ctx.body = await ctx.state.record.update(ctx.request.body.record)
})

// DELETE
router.delete('/:id', hasRoleMiddleware('admin'), async (ctx) => {
  ctx.body = await ctx.state.record.deleteOrder()
})

// APPROVE
router.put('/:id/approve', hasRoleMiddleware('admin'), async (ctx) => {
  ctx.body = await ctx.state.record.update({isApproved: true})
})

// ORDER JSON
router.get('/:id/json', async (ctx) => {
  ctx.body = await ctx.state.record.orderJson
})

// ORDER LOGS
router.get('/:id/logs', async (ctx) => {
  ctx.body = await ctx.state.record.getOrderLogs({
    order: [['id', 'ASC']],
    raw: true
  })
})

// ORDER TASKS
router.get('/:id/tasks', async (ctx) => {
  ctx.body = await ctx.state.record.CurrentWorkflow.getWorkflowTasks({
    include: [Plugin]
  })
})

// ORDER ROLLBACK
router.put('/:id/rollback', hasRoleMiddleware('admin'), async (ctx) => {
  ctx.body = await ctx.state.record.rollback('Order rollback by user')
})

// ORDER RESET
router.put('/:id/reset', hasRoleMiddleware('admin'), async (ctx) => {
  ctx.body = await ctx.state.record.reset('Order reset by user')
})

// ORDER ARCHIVE
router.put('/:id/archive', hasRoleMiddleware('admin'), async (ctx) => {
  ctx.body = await ctx.state.record.archive(ctx.request.body.description)
})

module.exports = router
