'use strict';
module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define('Job', {
    title: DataTypes.STRING
  }, {});

  Job.associate = function(models) {
    // associations can be defined here
//Job.belongsTo(models.Company);

  };
  return Job;
};