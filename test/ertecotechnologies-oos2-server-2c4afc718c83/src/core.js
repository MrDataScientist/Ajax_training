const { Job } = require('node-schedule')
const config = require('config')
const logger = require('./lib/logger').child(module)
const { Order } = require('./models')
const addOrders = require('./schedule-jobs/addOrders')
const processOrders = require('./schedule-jobs/processOrders')
const archiveOrders = require('./schedule-jobs/archiveOrders')
const rollbackOrders = require('./schedule-jobs/rollbackOrders')

const addOrdersJob = new Job('add-orders', addOrders)
const processOrdersJob = new Job('process-orders', processOrders)
const archiveOrdersJob = new Job('archive-orders', archiveOrders)
const rollbackOrdersJob = new Job('rollback-orders', rollbackOrders)

async function start () {
  logger.info('Unlocking all orders')
  await Order.unlockOrders()

  logger.info('Running all jobs immediately')
  await addOrders()
  await processOrders()
  await archiveOrders()
  await rollbackOrders()

  logger.info('Schedule all jobs')
  addOrdersJob.schedule(config.cron_add_orders)
  processOrdersJob.schedule(config.cron_process_orders)
  archiveOrdersJob.schedule(config.cron_archive_orders)
  rollbackOrdersJob.schedule(config.cron_rollback_orders)
}

async function stop () {
  logger.info('Stopping all scheduled jobs')
  addOrdersJob.cancel()
  processOrdersJob.cancel()
  archiveOrdersJob.cancel()
  rollbackOrdersJob.cancel()
}

module.exports = {
  start,
  stop
}
