const Bounce = require('bounce')
const logger = require('../lib/logger').child(module)
const { sequelize, Order, Plugin, Workflow, WorkflowTask } = require('../models')
const Op = sequelize.Op

module.exports = async function rollbackOrders () {
  logger.info('Auto rollback orders')

  const orders = await Order.findAll({
    where: {
      state: Order.states.processing
    },
    include: [{
      model: Workflow,
      as: 'CurrentWorkflow',
      include: [{
        model: WorkflowTask,
        where: {
          state: WorkflowTask.states.processing
        },
        include: [Plugin]
      }]
    }],
    // logging: console.log
  })

  for (const order of orders) {
    try {
      const task = order.CurrentWorkflow.WorkflowTasks[order.CurrentWorkflow.WorkflowTasks.length - 1]
      const now = new Date().getTime()
      const maxResponseTime = (task.Plugin.timeout * 1000) + task.timestamp.getTime()
      if (task.Plugin.timeout && now > maxResponseTime) {
        await order.rollback('Order archived by auto archiver job.', task)
      }
    } catch (err) {
      Bounce.rethrow(err, 'system')
      logger.warn(err)
    }
  }

  // const tasks = await WorkflowTask.findAll({
  //   where: {
  //     state: WorkflowTask.states.processing
  //   },
  //   include: [{
  //     model: Order,
  //     where: {
  //       state: Order.states.processing,
  //       CurrentWorkflowId: sequelize.col('WorkflowTask.WorkflowId')
  //     }
  //   }, {
  //     model: Plugin
  //   }],
  //   logging: console.log
  // })

  // for (const task of tasks) {
  //   try {
  //     const now = new Date().getTime()
  //     const maxResponseTime = (task.Plugin.timeout * 1000) + task.timestamp.getTime()
  //     if (task.Plugin.timeout && now > maxResponseTime) {
  //       await task.order.rollback('Order archived by auto archiver job.', task)
  //     }
  //   } catch (err) {
  //     Bounce.rethrow(err, 'system')
  //     logger.warn(err)
  //   }
  // }
}
