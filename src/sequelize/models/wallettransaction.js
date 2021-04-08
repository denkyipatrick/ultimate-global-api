'use strict';
module.exports = (sequelize, DataTypes) => {
  const WalletTransaction = sequelize.define('WalletTransaction', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    distributorWalletId: {
      type: DataTypes.UUID
    },
    amount: {
      defaultValue: 0,
      type: DataTypes.DOUBLE(10, 2)
    },
    type: {
      type: DataTypes.ENUM,
      values: ['deposit', 'withdrawal', 'transfer']
    },
    isProcessed: {
      defaultValue: false,
      type: DataTypes.BOOLEAN
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.BIGINT,
      defaultValue: new Date().getTime()
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.BIGINT,
      defaultValue: new Date().getTime()
    }
  }, {});
  WalletTransaction.associate = function(models) {
    // associations can be defined here
    WalletTransaction.belongsTo(models.DistributorWallet, {
      as: 'wallet',
      foreignKey: 'distributorWalletId'
    });

    WalletTransaction.hasOne(models.TransferTransaction, {
      as: 'transfer',
      foreignKey: 'transactionId'
    });
  };
  return WalletTransaction;
};