const path = require('path')
const fs = require('fs-extra')
const config = require('config')
const emailer = require('../lib/emailer')
const logger = require('../lib/logger').child(module)

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {type: DataTypes.STRING, primaryKey: true},
    state: {type: DataTypes.STRING},
    stateDescription: {type: DataTypes.TEXT},
    userId: {type: DataTypes.BIGINT},
    isApproved: {type: DataTypes.BOOLEAN, defaultValue: false},
    lockedAt: {type: DataTypes.DATE(6)},
    orderJson: {type: DataTypes.JSON},
    data: {type: DataTypes.JSON}
  }, {
    tableName: 'orders',
    paranoid: true,
    indexes: [{
      fields: ['state']
    }]
  })

  Order.states = {
    new: 'new',
    processing: 'processing',
    onhold: 'onhold',
    error: 'error',
    ready: 'ready',
    closed: 'closed'
  }

  Order.associate = models => {
    Order.belongsTo(models.Merchant)
    Order.belongsTo(models.Product)
    Order.hasMany(models.OrderLog)
    Order.hasMany(models.Workflow)
    Order.belongsTo(models.Workflow, {
      as: 'CurrentWorkflow',
      foreignKey: 'CurrentWorkflowId',
      constraints: false
    })

    Order.hasMany(models.WorkflowTask)
  }

  // STATIC METHODS
  // /////////////////////////////////////////////////////////////////

  Order.lockOrders = async (lockDate) => {
    lockDate = lockDate || new Date()

    const where = {
      isApproved: true,
      state: {[sequelize.Op.in]: ['new', 'processing', 'onhold']},
      lockedAt: null
    }

    await Order.update({lockedAt: lockDate}, {where})

    return lockDate
  }

  Order.unlockOrders = async (lockDate) => {
    const where = {}

    if (lockDate) {
      where.lockedDate = lockDate
    }

    await Order.update({lockedAt: null}, {where})
  }

  // INSTANCE METHODS
  // ///////////////////////////////////////////////////////////////////

  Order.prototype.getDirectory = function () {
    return path.join(
      config.orders_dir,
      this.id
    )
  }

  Order.prototype.getArchiveDirectory = function () {
    return path.join(
      config.orders_archive_dir,
      this.id
    )
  }

  Order.prototype.getJsonFile = function () {
    return path.join(this.getDirectory(), 'order.json')
  }

  // CREATE WORKFLOW
  Order.prototype.createWorkflow = async function (options = {}) {
    const { Workflow, WorkflowTask, Plugin } = sequelize.models
    const product = await this.getProduct({})
    const productTasks = await product.getProductTasks({
      include: Plugin
    })

    // Free all PluginInstances for the order
    await WorkflowTask.update({PluginInstanceId: null}, {
      where: {
        OrderId: this.id
      },
      transaction: options.transaction
    })

    const workflow = await Workflow.create({
      OrderId: this.id,
      state: 'new',
      isCurrent: true,
      WorkflowTasks: productTasks.map(productTask => {
        return {
          state: WorkflowTask.states.new,
          PluginId: productTask.PluginId,
          OrderId: this.id,
          priority: productTask.priority,
          blockers: productTask.blockers,
          settings: productTask.settings,
          pluginName: productTask.Plugin.name
        }
      })
    }, {
      include: [WorkflowTask],
      transaction: options.transaction,
      // logging: console.log
    })

    // Create all directoris
    for (const workflowTask of workflow.WorkflowTasks) {
      await fs.ensureDir(workflowTask.getInDirectory())
      await fs.ensureDir(workflowTask.getOutDirectory())
    }

    // Create json file in order's directory
    await fs.writeJson(this.getJsonFile(), this.orderJson, {spaces: 2})

    // Assign current workflow
    this.CurrentWorkflowId = workflow.id
    await this.save({transaction: options.transaction})

    return workflow
  }

  // UNLOCK ORDER
  Order.prototype.unlock = async function (state) {
    this.lockedAt = null
    await this.save()
  }

  // UPDATE ORDER STATE
  Order.prototype.updateState = async function (state, description, data, options = {}) {
    const transaction = options.transaction || null

    this.state = state
    this.stateDescription = description
    this.data = data

    if (state === Order.states.ready) {
      const product = this.Product || await this.getProduct()

      // Set stateDescription if product has one
      this.stateDescription = product.orderDoneDescription

      // Send email
      emailer.sendTemplate('email-order-done', {
        order: this.toJSON(),
        product: product.toJSON()
      }, {
        to: this.orderJson.user.UserMail,
        subject: 'Order done'
      })
    }
    await this.save({transaction})
  }

  // RESET ORDER
  Order.prototype.reset = async function (description) {
    this.state = Order.states.onhold
    this.stateDescription = description

    await this.save()
    const workflow = await this.createWorkflow()

    // Create order log
    await this.createOrderLog({
      state: this.state,
      message: `Order reset: ${description}`,
      WorkflowId: workflow.id
    })

    // Send order reset email
    const product = this.Product || await this.getProduct()
    emailer.sendTemplate('email-order-reset', {
      order: this.toJSON(),
      product: product.toJSON()
    }, {
      to: this.orderJson.user.UserMail,
      subject: `${config.email.subject_prefix} Order reset`
    })
  }

  // ROLLBACK ORDER
  Order.prototype.rollback = async function (description, task) {
    const { WorkflowTask } = sequelize.models
    const workflow = await this.getCurrentWorkflow()
    const tasks = await workflow.getWorkflowTasks()

    let rollbackTask = tasks.find(t => t.state === WorkflowTask.states.processing || t.state === WorkflowTask.states.error)

    if (rollbackTask) {
      await rollbackTask.setState('new', {
        stateDescription: description
      })

      // Create order log
      await this.createOrderLog({
        state: this.state,
        message: `Order rollback task ${rollbackTask.id}`,
        WorkflowId: this.CurrentWorkflowId,
        WorkflowTaskId: rollbackTask.id
      })

      // Send order rollback email
      const product = this.Product || await this.getProduct()
      emailer.sendTemplate('email-order-rollback', {
        order: this.toJSON(),
        product: product.toJSON()
      }, {
        to: this.orderJson.user.UserMail,
        subject: `${config.email.subject_prefix} Order rollback`
      })
    } else {
      logger.warn(`${this.id}: No task to rollback`)
    }
  }

  // ARCHIVE ORDER
  Order.prototype.archive = async function (description) {
    const { Product, Merchant, Workflow, WorkflowTask, OrderLog } = sequelize.models

    // Change state and descriptoin
    this.state = Order.states.closed
    this.stateDescription = description
    await this.save()

    // Move directory
    await fs.move(this.getDirectory(), this.getArchiveDirectory())

    // Create db json file
    const orderDB = await Order.findById(this.id, {
      include: [
        Product,
        Merchant,
        OrderLog,
        {
          model: Workflow,
          include: [WorkflowTask]
        }
      ]
    })
    await fs.writeJson(path.join(this.getArchiveDirectory(), 'order-db.json'), orderDB.toJSON(), {spaces: 2})

    // Create order log
    await this.createOrderLog({
      state: this.state,
      message: description,
      WorkflowId: this.CurrentWorkflowId
    })
  }

  // DELETE ORDER
  Order.prototype.deleteOrder = async function () {
    const { Workflow, WorkflowTask } = sequelize.models
    const transaction = await sequelize.transaction()

    try {
      await WorkflowTask.update({PluginInstanceId: null}, {
        where: {
          OrderId: this.id
        },
        transaction
      })
      await Workflow.destroy({
        where: {
          OrderId: this.id
        },
        transaction
      })
      await WorkflowTask.destroy({
        where: {
          OrderId: this.id
        },
        transaction
      })
      await this.destroy({transaction})
      return transaction.commit()
    } catch (err) {
      transaction.rollback()
      throw err
    }
  }

  return Order
}
