'use strict';
module.exports = (sequelize, DataTypes) => {
  const TransferTransaction = sequelize.define('TransferTransaction', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    senderUsername: {
      type: DataTypes.STRING
    },
    receiverUsername: {
      type: DataTypes.STRING
    },
    transactionId: {
      type: DataTypes.UUID
    },
  }, {});
  TransferTransaction.associate = function(models) {
    // associations can be defined here
  };
  return TransferTransaction;
};