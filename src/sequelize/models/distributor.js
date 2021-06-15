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
    distributorLevelId: {
      type: DataTypes.UUID
    },    
    phoneNumber: {
      type: DataTypes.STRING
    },
    emailAddress: {
      type: DataTypes.STRING
    },
    dateOfBirth: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    city: {
      type: DataTypes.STRING
    },
    country: {
      type: DataTypes.STRING
    },
    bankName: {
      type: DataTypes.STRING
    },
    swiftCode: {
      type: DataTypes.STRING
    },
    accountNumber: {
      type: DataTypes.STRING
    },
    accountName: {
      type: DataTypes.STRING
    },
    nextOfKinName: {
      type: DataTypes.STRING
    },
    lastLogin: {
      type: DataTypes.DATE
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