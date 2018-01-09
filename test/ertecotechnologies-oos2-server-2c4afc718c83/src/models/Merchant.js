module.exports = (sequelize, DataTypes) => {
  const Merchant = sequelize.define('Merchant', {
    token: {type: DataTypes.STRING},
    name: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING}
  }, {
    tableName: 'merchants',
    paranoid: true
  })

  Merchant.associate = models => {
    Merchant.hasMany(models.Order)
  }

  Merchant.findByToken = token => {
    return Merchant.findOne({
      where: {
        token: token
      }
    })
  }

  return Merchant
}