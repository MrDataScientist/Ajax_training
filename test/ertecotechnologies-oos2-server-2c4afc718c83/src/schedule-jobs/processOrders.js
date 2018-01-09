const Bounce = require('bounce')
const logger = require('../lib/logger').child(module)
const { sequelize, Order, Workflow, WorkflowTask, PluginInstance } = require('../models')
const pluginModules = require('../plugins')

module.exports = async function processOrders () {
  logger.info(`Process orders`)

  // Lock orders to process
  const lockDate = new Date()
  await Order.update({lockedAt: lockDate}, {
    where: {
      isApproved: true,
      state: {[sequelize.Op.in]: ['new', 'processing', 'onhold']},
      lockedAt: null
    }
  })

  // Get locked orders for further processing
  const orders = await Order.findAll({
    where: {
      lockedAt: lockDate
    },
    order: [['createdAt', 'asc']]
  })

  for (const order of orders) {
    try {
      const workflow = await order.getCurrentWorkflow()
      const tasks = await workflow.getTasksToProcess()

      for (const task of tasks) {
        const plugin = await task.getPlugin({
          where: {
            isActive: true
          },
          include: [{
            model: PluginInstance,
            include: [WorkflowTask]
          }]
        })

        if (!plugin || !plugin.PluginInstances.length === 0) {
          this.logger.warn(`Order ${order.id}, task ${task.id} had no plugin or plugin instances`)
          continue
        }

        const processingPluginInstance = plugin.PluginInstances.find(pi => pi.WorkflowTasks.find(wt => wt.PluginInstanceId === task.PluginInstanceId))
        const availablePluginInstance = plugin.PluginInstances.find(pi => pi.WorkflowTasks.length === 0)

        let instance
        const blockers = await task.getBlockerTasks()

        const params = {
          task,
          blockers,
          workflow,
          order,
          plugin,
          pluginInstance: null
        }

        switch (task.state) {
          case 'new':
          case 'onhold':
            if (availablePluginInstance) {
              params.pluginInstance = availablePluginInstance
              instance = new pluginModules[plugin.source](params)

              await instance._init()
              await task.setState('processing', {PluginInstanceId: availablePluginInstance.id})
              await instance._run(true)
            } else {
              if (task.state === 'new') {
                await task.setState('onhold')
              }
            }
            break
          case 'processing':
            params.pluginInstance = processingPluginInstance
            instance = new pluginModules[plugin.source](params)

            await instance._init()
            await instance._run(false)
            break
        }
      }
      await order.unlock()
    } catch (err) {
      await order.unlock()
      Bounce.rethrow(err, 'system')
      logger.warn(err)
      // Bounce.ignore(err, MyAppError)
    }
  }
}
