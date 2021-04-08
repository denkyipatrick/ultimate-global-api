'use strict';
module.exports = (sequelize, DataTypes) => {
  const DistributorLevelGeneration = sequelize.define('DistributorLevelGeneration', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    username: {
      type: DataTypes.STRING
    },
    upLineUsername: {
      type: DataTypes.STRING
    },
    parentId: {
      type: DataTypes.UUID
    },
    levelId: {
      type: DataTypes.UUID
    },
    position: {
      type: DataTypes.ENUM,
      values: ['none', 'left', 'right'],
      defaultValue: 'left'
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
  DistributorLevelGeneration.associate = function(models) {
    // associations can be defined here
    DistributorLevelGeneration.belongsTo(models.Distributor, {
      as: 'distributor',
      foreignKey: 'username'
    });

    // associations can be defined here
    DistributorLevelGeneration.belongsTo(models.Distributor, {
      as: 'upLine',
      foreignKey: 'upLineUsername'
    });
    
    // associations can be defined here
    DistributorLevelGeneration.belongsTo(models.DistributorLevelGeneration, {
      as: 'parent',
      foreignKey: 'parentId'
    });

    DistributorLevelGeneration.hasMany(models.DistributorLevelGeneration, {
      as: 'downLines',
      foreignKey: 'parentId'
    });
  };
  return DistributorLevelGeneration;
};