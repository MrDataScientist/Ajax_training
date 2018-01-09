const Bounce = require('bounce')
// Set moment's global UTC offset (Sequelize probably uses this... not sure)
const moment = require('moment')
moment().utcOffset(2)
const config = require('config')
const logger = require('./lib/logger').logger
const core = require('./core')
const server = require('./server')

;(async () => {
  try {
    await core.start()
    server.listen(config.port, () => {
      logger.info(`Server running in ${config.env} on port ${config.port}`)
    })
  } catch (err) {
    logger.error(err)
    throw err
  }
})()

process.on('unhandledRejection', err => {
  logger.error(err)
  throw err
  // Bounce.rethrow(err, 'system')
  // console.log('process hook unhandledRejection', error.message)
})

// process.on('SIGINT', () => {
//   await core.stop()
//   server.close()
//   db.stop(err => {
//     process.exit(err ? 1 : 0)
//   })
// })
