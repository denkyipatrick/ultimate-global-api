'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    distributorUsername: {
      type: DataTypes.STRING
    },
    message: {
      type: DataTypes.STRING(1024)
    },
    type: {
      type: DataTypes.STRING
    },
  }, {});
  Notification.associate = function(models) {
    // associations can be defined here
  };
  return Notification;
};