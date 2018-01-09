const Router = require('koa-router')
const { hasRoleMiddleware } = require('./auth_helpers')
const { Plugin: Model, PluginInstance, Sequelize } = require('../models')
const Op = Sequelize.Op
const sources = require('../plugins')

const router = Router()

// ONLY ADMINS
router.use(hasRoleMiddleware('admin'))

router.param('id', async (id, ctx, next) => {
  ctx.state.record = await Model.findById(id, {
    include: [PluginInstance]
  })
  if (ctx.state.record) {
    await next()
  } else {
    ctx.throw(404, 'Record not found')
  }
})

router.param('instanceId', async (instanceId, ctx, next) => {
  ctx.state.instance = await PluginInstance.findById(instanceId, {})
  if (ctx.state.instance) {
    await next()
  } else {
    ctx.throw(404, 'Record not found')
  }
})

// GET PLUGINS SOURCES LIST
router.get('/sources', async (ctx, next) => {
  const plugins = await Model.findAll()

  ctx.body = Object.keys(sources).map(key => {
    return {
      file: key,
      name: sources[key].name,
      count: plugins.filter(p => p.source === key).length
    }
  })
})

// GET PLUGIN/INSTANCE/TASK OPTIONS DEFINITION
router.get('/settings-definition', async (ctx, next) => {
  let source = ctx.query.source
  if (ctx.query.pluginId) {
    const plugin = await Model.findById(ctx.query.pluginId)
    source = plugin.source
  }

  const definitions = sources[source].settingsDefinition

  ctx.body = ctx.query.scope
    ? definitions.filter(d => d.scope.includes(ctx.query.scope))
    : definitions
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
    where: {
      // source: {
      //   [Op.ne]: null
      // }
    },
    include: [PluginInstance],
    offset: params.pageNo * params.pageSize,
    limit: params.pageSize,
    order: [[params.orderBy, params.orderDir]]
  }

  if (params.search) {
    query.where[Op.or] = [
      {name: {[Op.like]: `%${params.search}%`}},
      // {type: {[Op.like]: `%${params.search}%`}},
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

// PLUGIN INSTANCES ////////////////////////////////////

// GET INSTANCES
router.get('/:id/instances', async (ctx) => {
  ctx.body = ctx.state.record.PluginInstances
})

// GET INSTANCE
router.get('/:id/instances/:instanceId', async (ctx) => {
  ctx.body = ctx.state.instance
})

// CREATE INSTANCE
router.post('/:id/instances', async (ctx, next) => {
  ctx.request.body.record.PluginId = ctx.state.record.id
  ctx.body = await PluginInstance.create(ctx.request.body.record)
})

// UPDATE INSTANCE
router.put('/:id/instances/:instanceId', async (ctx) => {
  ctx.body = await ctx.state.instance.update(ctx.request.body.record)
})

// DELETE INSTANCE
router.delete('/:id/instances/:instanceId', async (ctx) => {
  ctx.body = await ctx.state.instance.destroy()
})

module.exports = router
