const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
    name: {type: DataTypes.STRING},
    username: {type: DataTypes.STRING, defaultValue: ''},
    hash: {type: DataTypes.STRING},
    password: {
      type: DataTypes.VIRTUAL,
      set: function (val) {
        this.setDataValue('password', val)
        this.setDataValue('hash', bcrypt.hashSync(val, bcrypt.genSaltSync(12)))
      }
    },
    roles: {type: DataTypes.JSON}
  }, {
    tableName: 'admins'
  })

  Admin.prototype.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.hash)
  }

  return Admin
}
