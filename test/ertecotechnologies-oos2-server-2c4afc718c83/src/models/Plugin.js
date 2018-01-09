const plugins = require('../plugins')

module.exports = (sequelize, DataTypes) => {
  const Plugin = sequelize.define('Plugin', {
    name: {type: DataTypes.STRING},
    source: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING, defaultValue: ''},
    timeout: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
    isActive: {type: DataTypes.BOOLEAN, defaultValue: false},
    settings: {type: DataTypes.JSON, defaultValue: () => ({})}
  }, {
    tableName: 'plugins',
    paranoid: true
  })

  Plugin.associate = models => {
    Plugin.hasMany(models.PluginInstance)
  }

  // Plugin.prototype.getSourceFile = function () {
  //   return plugins[this.source]
  // }

  // Plugin.prototype.getOptionsDefinition = function (scope) {
  //   const sourceFile = this.getSourceFile()
  //   const definitions = sourceFile.getOptionsDefinition()
  //   if (scope) {
  //     return definitions.filter(d => d.scope.includes(scope))
  //   }
  //   return definitions
  // }

  return Plugin
}
