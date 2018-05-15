'use strict';
module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    name: DataTypes.STRING,
    city: DataTypes.STRING,
    address: DataTypes.STRING
  }, {});
  Company.associate = function(models) {
    // associations can be defined here
     // Company.hasMany(models.Job)
  };
  return Company;
};