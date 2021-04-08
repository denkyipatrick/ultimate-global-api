'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    text: {
      type: DataTypes.STRING(1024)
    },
    distributorUsername: {
      type: DataTypes.STRING
    },
    isViewed: {
      type: DataTypes.BOOLEAN
    }
  }, {});
  Message.associate = function(models) {
    // associations can be defined here
    Message.belongsTo(models.Distributor, {
      as: 'sender',
      foreignKey: 'distributorUsername'
    });
  };
  return Message;
};