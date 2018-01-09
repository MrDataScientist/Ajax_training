module.exports = (sequelize, DataTypes) => {
  const OrderLog = sequelize.define('OrderLog', {
    state: {type: DataTypes.STRING},
    message: {type: DataTypes.TEXT}
  }, {
    tableName: 'order_logs',
    paranoid: true
  })

  OrderLog.associate = models => {
    OrderLog.belongsTo(models.Order)
    OrderLog.belongsTo(models.Workflow)
    OrderLog.belongsTo(models.WorkflowTask)
    OrderLog.belongsTo(models.Plugin)
    OrderLog.belongsTo(models.PluginInstance)
  }

  return OrderLog
}
