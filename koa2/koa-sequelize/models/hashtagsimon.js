'use strict';
module.exports = (sequelize, DataTypes) => {
  var HashtagSimon = sequelize.define('HashtagSimon', {
    abi: DataTypes.STRING,
    account_addr: DataTypes.STRING,
    version: DataTypes.STRING
  }, {});
  HashtagSimon.associate = function(models) {
    // associations can be defined here
  };
  return HashtagSimon;
};