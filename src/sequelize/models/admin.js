'use strict';
module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
    username: {
      primaryKey: true,
      type: DataTypes.STRING
    },
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
  }, {});
  Admin.associate = function(models) {
    // associations can be defined here
  };
  return Admin;
};