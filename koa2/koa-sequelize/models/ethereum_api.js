'use strict';
module.exports = (sequelize, DataTypes) => {
  var Ethereum_api = sequelize.define('Ethereum_api', {
    abi: DataTypes.STRING
  }, {});
  Ethereum_api.associate = function(models) {
    // associations can be defined here
  };
  return Ethereum_api;
};