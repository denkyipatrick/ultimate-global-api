'use strict';

module.exports = (sequelize, DataTypes) => {
  const UpLineLevelDownLine = sequelize.define('UpLineLevelDownLine', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    upLineLevelId: {
      type: DataTypes.UUID
    },
    downLineUsername: {
      type: DataTypes.STRING
    },
    upLineUsername: {
      type: DataTypes.STRING
    },
    position: {
      type: DataTypes.ENUM,
      values: ['left', 'right']
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
  UpLineLevelDownLine.associate = function(models) {
    // associations can be defined here
    UpLineLevelDownLine.belongsTo(models.Distributor, {
      as: 'upLineInfo',
      foreignKey: 'upLineUsername'
    });

    UpLineLevelDownLine.belongsTo(models.Distributor, {
      as: 'downLineInfo',
      foreignKey: 'downLineUsername'
    });
  };
  return UpLineLevelDownLine;
};