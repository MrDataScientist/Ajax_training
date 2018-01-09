const Router = require('koa-router')
const { hasRoleMiddleware } = require('./auth_helpers')
const logger = require('../lib/logger').logger

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

  const countOptions = {
    from: new Date() - (24 * 60 * 60 * 1000),
    start: 0,
    limit: Number.MAX_VALUE,
    fields: ['randomStringXyzdfskg']
  }

  const options = {
    from: new Date() - (24 * 60 * 60 * 1000),
    until: new Date(),
    limit: params.pageSize,
    start: params.pageNo * params.pageSize,
    order: 'desc',
    // fields: ['message']
  }

  const queryPromise = new Promise((resolve, reject) => {
    logger.query(countOptions, (err, count) => {
      if (err) {
        reject('Error counting the logs')
      }
      logger.query(options, (err, results) => {
        if (err) {
          reject('Error quering the logs')
        }

        resolve({
          totalCount: count.dailyRotateFile.length,
          filteredCount: count.dailyRotateFile.length,
          records: results.dailyRotateFile
        })
      })
    })
  })

  ctx.body = await queryPromise
})

module.exports = router
