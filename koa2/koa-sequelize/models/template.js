'use strict';
module.exports = (sequelize, DataTypes) => {
  var Template = sequelize.define('Template', {
    SKU: DataTypes.STRING,
    data: DataTypes.STRING,
    version: DataTypes.STRING,
    abi: DataTypes.STRING,
    bytecode: DataTypes.STRING
  }, {});
  Template.associate = function(models) {
    // associations can be defined here
  };
  return Template;
};