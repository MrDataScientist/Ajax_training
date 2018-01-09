module.exports = (sequelize, DataTypes) => {
  const PluginInstance = sequelize.define('PluginInstance', {
    settings: {type: DataTypes.JSON, defaultValue: () => ({})}
  }, {
    tableName: 'plugin_instances',
    paranoid: true
  })

  PluginInstance.associate = models => {
    PluginInstance.belongsTo(models.Plugin)
    PluginInstance.hasMany(models.WorkflowTask)
  }

  return PluginInstance
}
