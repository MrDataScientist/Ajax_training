const fs = require('fs-extra')
const path = require('path')
const config = require('config')
const Router = require('koa-router')
const { hasRoleMiddleware } = require('./auth_helpers')

const router = Router()

// ONLY ADMINS
router.use(hasRoleMiddleware('admin'))

// COLLECTION
router.get('/', async ctx => {
  const params = {
    pageNo: 1,
    pageSize: 20,
    orderBy: 'name',
    orderDir: 'ASC',
    ...ctx.query
  }
  params.pageNo = parseInt(params.pageNo) - 1
  params.pageSize = parseInt(params.pageSize)

  let files = await fs.readdir(config.orders_unknown_dir)

  // Only .json files
  files = files.filter(f => f.split('.').pop().toLowerCase() === 'json')
  const totalCount = files.length

  // Filter
  if (params.search) {
    files = files.filter(f => f.indexOf(params.search) !== -1)
  }

  // Sort by name
  files = files.sort()

  // Pagination
  files = files.slice(params.pageNo * params.pageSize, (params.pageNo + 1) * params.pageSize)

  // Make the objects
  files = files.map(f => ({name: f}))

  ctx.body = { totalCount, filteredCount: files.length, records: files }
})

router.get('/:filename/json', async ctx => {
  ctx.body = await fs.readJson(path.join(config.orders_unknown_dir, ctx.params.filename))
})

router.post('/:filename/move', async ctx => {
  await fs.move(path.join(config.orders_unknown_dir, ctx.params.filename), path.join(config.orders_input_dir, ctx.params.filename))
  ctx.body = true
})

module.exports = router
