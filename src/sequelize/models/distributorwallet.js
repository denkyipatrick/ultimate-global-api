'use strict';
module.exports = (sequelize, DataTypes) => {
  const DistributorWallet = sequelize.define('DistributorWallet', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    pin: {
      type: DataTypes.STRING
    },
    balance: {
      defaultValue: 0,
      type: DataTypes.DOUBLE
    },
    distributorUsername: {
      allowNull: false,
      type: DataTypes.STRING
    }
    // createdAt: {
    //   allowNull: false,
    //   type: DataTypes.BIGINT,
    //   defaultValue: new Date().getTime()
    // },
    // updatedAt: {
    //   allowNull: false,
    //   type: DataTypes.BIGINT,
    //   defaultValue: new Date().getTime()
    // }
  }, {});
  DistributorWallet.associate = function(models) {
    // associations can be defined here
    DistributorWallet.belongsTo(models.Distributor, {
      as: 'distributor',
      foreignKey: 'distributorUsername'
    });
  };
  return DistributorWallet;
};