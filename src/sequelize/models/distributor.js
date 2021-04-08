'use strict';
module.exports = (sequelize, DataTypes) => {
  const Distributor = sequelize.define('Distributor', {
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
    sponsorUsername: {
      type: DataTypes.STRING
    },
    // upLineUsername: {
    //   type: DataTypes.STRING
    // },
    distributorLevelId: {
      type: DataTypes.UUID
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
  Distributor.associate = function(models) {
    // associations can be defined here

    Distributor.hasMany(models.UpLineLevel, {
      as: 'levels',
      foreignKey: 'distributorUsername'
    });

    Distributor.belongsTo(models.Distributor, {
      as: 'sponsor',
      foreignKey: 'sponsorUsername'
    });

    Distributor.hasOne(models.DistributorWallet, {
      as: 'wallet',
      foreignKey: 'distributorUsername'
    });

    Distributor.belongsTo(models.DistributorLevel, {
      as: 'stage',
      foreignKey: 'distributorLevelId'
    });
  };
  return Distributor;
};