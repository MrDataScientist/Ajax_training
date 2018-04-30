module.exports = (sequelize, DataTypes) => {
  const Merchant = sequelize.define('Merchant', {
    token: {type: DataTypes.STRING},
    name: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING},
    paymentCheckUrl: {type: DataTypes.STRING},
    apiKey: {type: DataTypes.STRING}
  }, {
    tableName: 'merchants',
    paranoid: true
  })

  Merchant.associate = models => {
    // Merchant.hasMany(models.Order)
  }

  Merchant.findByToken = token => {
    return Merchant.findOne({
      where: {
        token: token
      }
    })
  }

  Merchant.prototype.resetApiKey = async function () {
    this.apiKey = 'some random string'
    return await this.save()
  }

  Merchant.afterCreate(async (merchant, options) => {
    await merchant.resetApiKey()
  })

  return Merchant
}