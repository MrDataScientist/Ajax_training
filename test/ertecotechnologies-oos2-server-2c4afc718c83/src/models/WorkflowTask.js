const path = require('path')
const config = require('config')
const emailer = require('../lib/emailer')
const logger = require('../lib/logger').child(module)

module.exports = (sequelize, DataTypes) => {
  const WorkflowTask = sequelize.define('WorkflowTask', {
    state: {type: DataTypes.STRING, allowNull: false},
    stateDescription: {type: DataTypes.TEXT},
    priority: {type: DataTypes.INTEGER, allowNull: false},
    blockers: {type: DataTypes.JSON, defaultValue: () => ([])},
    timestamp: {type: DataTypes.DATE},
    data: {type: DataTypes.JSON, defaultValue: () => ({})},
    settings: {type: DataTypes.JSON, defaultValue: () => ({})},
    pluginName: {type: DataTypes.STRING}
  }, {
    tableName: 'workflow_tasks',
    paranoid: true,
    defaultScope: {
      order: [['priority', 'asc']]
    }
  })

  WorkflowTask.states = {
    new: 'new',
    processing: 'processing',
    onhold: 'onhold',
    error: 'error',
    ready: 'ready'
  }

  WorkflowTask.associate = models => {
    WorkflowTask.belongsTo(models.Workflow)
    // WorkflowTask.belongsTo(models.Product)
    WorkflowTask.belongsTo(models.Order)
    WorkflowTask.belongsTo(models.Plugin)
    WorkflowTask.belongsTo(models.PluginInstance)
    WorkflowTask.hasMany(models.OrderLog)
  }

  WorkflowTask.prototype.getDirectory = function () {
    return path.join(
      config.orders_dir,
      this.OrderId,
      `workflow_${this.WorkflowId}`,
      `${this.priority}_${this.pluginName}_${this.id}`
    )
  }

  WorkflowTask.prototype.getInDirectory = function () {
    return path.join(
      this.getDirectory(),
      'in'
    )
  }

  WorkflowTask.prototype.getOutDirectory = function () {
    return path.join(
      this.getDirectory(),
      'out'
    )
  }

  WorkflowTask.prototype.getBlockerTasks = async function () {
    return await WorkflowTask.findAll({
      where: {
        WorkflowId: this.WorkflowId,
        priority: {[sequelize.Op.in]: this.blockers}
      }
    })
  }

  // WorkflowTask.prototype.setState = async function (state, payload) {
  //   payload = Object.assign({
  //     PluginInstanceId: null,
  //     stateDescription: '',
  //     data: null,
  //     err: null
  //   }, payload)

  //   const workflow = await this.getWorkflow()
  //   const errorString = payload.err ? `${payload.err.message} ${payload.err.stack}` : ''

  //   this.state = state
  //   this.stateDescription = payload.stateDescription || errorString
  //   this.PluginInstanceId = payload.PluginInstanceId
  //   this.data = payload.data || payload.err
  //   this.timestamp = new Date()

  //   if (payload.err) {
  //     logger.error(`Task ${this.id} set to '${state}' ${this.stateDescription} | ${this.OrderId}`, payload.err)
  //   } else {
  //     logger.info(`Task ${this.id} set to '${state}' ${this.stateDescription} | ${this.OrderId}`, payload.data)
  //   }

  //   // if (state === WorkflowTask.states.ready) {
  //   //   emailer.sendTemplate('email-task-done', {}, {
  //   //     subject: `${config.email.subject_prefix} ${this.pluginName} done on order ${this.OrderId}`
  //   //   })
  //   // }

  //   await this.save()
  //   await workflow.updateState()
  //   await this.createOrderLog({
  //     state: workflow.state,
  //     message: `Task ${this.id} set to '${state}' ${errorString}`,
  //     OrderId: this.OrderId,
  //     WorkflowId: this.WorkflowId,
  //     PluginId: this.PluginId,
  //     PluginInstanceId: payload.PluginInstanceId || this.PluginInstanceId
  //   })
  // }

  WorkflowTask.prototype.setState = async function (state, payload, options = {}) {
    const transaction = options.transaction || await sequelize.transaction({logging: false})
    try {
      payload = Object.assign({
        PluginInstanceId: null,
        stateDescription: '',
        data: null,
        error: null
      }, payload)

      const workflow = await this.getWorkflow({transaction})
      const errorString = payload.error ? `${payload.error.message} ${payload.error.stack}` : ''

      this.state = state
      this.stateDescription = payload.stateDescription || errorString
      this.PluginInstanceId = payload.PluginInstanceId
      this.data = payload.data || payload.error
      this.timestamp = new Date()

      if (payload.error) {
        logger.error(`Task ${this.id} set to '${state}' ${this.stateDescription} | ${this.OrderId}`, payload.error)
      } else {
        logger.info(`Task ${this.id} set to '${state}' ${this.stateDescription} | ${this.OrderId}`, payload.data)
      }

      // if (state === WorkflowTask.states.ready) {
      //   emailer.sendTemplate('email-task-done', {}, {
      //     subject: `${config.email.subject_prefix} ${this.pluginName} done on order ${this.OrderId}`
      //   })
      // }

      await this.save({transaction})
      await workflow.updateState({transaction})
      await this.createOrderLog({
        state: workflow.state,
        message: `Task ${this.id} set to '${state}' ${errorString}`,
        OrderId: this.OrderId,
        WorkflowId: this.WorkflowId,
        PluginId: this.PluginId,
        PluginInstanceId: payload.PluginInstanceId || this.PluginInstanceId
      }, {transaction})
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }

  return WorkflowTask
}
