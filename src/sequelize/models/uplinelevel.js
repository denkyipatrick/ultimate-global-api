'use strict';
module.exports = (sequelize, DataTypes) => {
  const UpLineLevel = sequelize.define('UpLineLevel', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    distributorUsername: {
      type: DataTypes.STRING
    },
    upLineUsername: {
      type: DataTypes.STRING
    },
    levelId: {
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
  UpLineLevel.associate = function(models) {
    // associations can be defined here
    UpLineLevel.hasMany(models.UpLineLevelDownLine, {
      as: 'downLines',
      foreignKey: 'upLineLevelId'
    });

    UpLineLevel.belongsTo(models.Distributor, {
      as: 'distributorInfo',
      foreignKey: 'distributorUsername'
    });

    UpLineLevel.belongsTo(models.Distributor, {
      as: 'upLineInfo',
      foreignKey: 'upLineUsername'
    });
  };
  return UpLineLevel;
};