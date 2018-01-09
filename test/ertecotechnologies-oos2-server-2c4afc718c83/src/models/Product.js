module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: {type: DataTypes.STRING},
    token: {type: DataTypes.STRING, unique: true},
    description: {type: DataTypes.STRING},
    archiveDays: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 30},
    orderApproval: {type: DataTypes.BOOLEAN, defaultValue: false},
    orderDoneDescription: {type: DataTypes.STRING, defaultValue: 'Order ready to download'}
  }, {
    tableName: 'products',
    paranoid: true
  })

  Product.associate = models => {
    Product.hasMany(models.Order)
    Product.hasMany(models.ProductTask)
  }

  Product.findByToken = token => {
    return Product.findOne({
      where: {
        token: token
      }
    })
  }

  return Product
}
