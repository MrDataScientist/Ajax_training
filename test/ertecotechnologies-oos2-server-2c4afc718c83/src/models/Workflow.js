module.exports = (sequelize, DataTypes) => {
  const Workflow = sequelize.define('Workflow', {
    state: {type: DataTypes.STRING},
    stateDescription: {type: DataTypes.TEXT},
    data: {type: DataTypes.JSON}
  }, {
    tableName: 'workflows',
    paranoid: true
  })

  Workflow.associate = models => {
    Workflow.belongsTo(models.Order)
    Workflow.hasMany(models.WorkflowTask, {
      scope: {

      }
    })
  }

  Workflow.prototype.getDirectory = function () {
    return path.join(
      config.orders_dir,
      this.OrderId,
      `workflow_${this.id}`
    )
  }

  Workflow.prototype.getTasksToProcess = async function () {
    // const { WorkflowTask } = Workflow.associations // sequelize.models

    const tasks = await this.getWorkflowTasks()

    for (const task of tasks) {
      if (task.state === 'new' || task.state === 'processing' || task.state === 'onhold') {
        if (!task.blockers || task.blockers.length === 0) {
          return [task]
        }

        const blockersReady = task.blockers.every(b => tasks[b - 1].state === 'ready')

        if (blockersReady) {
          return [task]
        }
      }
    }

    return []
  }

  Workflow.prototype.updateState = async function (options = {}) {
    const transaction = options.transaction || null

    // const { WorkflowTask } = sequelize.models
    const order = await this.getOrder({transaction})
    const tasks = await this.getWorkflowTasks({transaction})
    this.data = {}
    const count = {}
    for (let task of tasks) {
      count[task.state] = count[task.state] === undefined ? 1 : count[task.state] + 1
      if (task.state !== 'new') {
        this.stateDescription = task.stateDescription
        this.data = Object.assign(this.data, task.data)
      }
    }

    if (count.error) {
      this.state = 'error'
    } else if (count.processing) {
      this.state = 'processing'
    } else if (count.onhold) {
      this.state = 'onhold'
    } else if (count.new && count.new !== tasks.length) {
      this.state = 'onhold'
    } else if (count.ready === tasks.length) {
      this.state = 'ready'
    }

    await this.save({transaction})
    await order.updateState(this.state, this.stateDescription, this.data, {transaction})
  }

  return Workflow
}
