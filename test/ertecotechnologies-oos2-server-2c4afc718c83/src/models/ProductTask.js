module.exports = (sequelize, DataTypes) => {
  const ProductTask = sequelize.define('ProductTask', {
    priority: {type: DataTypes.INTEGER},
    blockers: {type: DataTypes.JSON, defaultValue: () => ([])},
    settings: {type: DataTypes.JSON, defaultValue: () => ({})}
  }, {
    tableName: 'product_tasks',
    paranoid: true,
    defaultScope: {
      order: [['priority', 'asc'], ['id', 'asc']]
    }
  })

  ProductTask.associate = models => {
    ProductTask.belongsTo(models.Product)
    ProductTask.belongsTo(models.Plugin)
  }

  return ProductTask
}
