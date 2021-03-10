'use strict';
module.exports = (sequelize, DataTypes) => {
  const DistributorLevel = sequelize.define('DistributorLevel', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING
    },
    number: {
      type: DataTypes.INTEGER
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
  DistributorLevel.associate = function(models) {
    // associations can be defined here
    // DistributorLevel.hasOne(models.DistributorLevel, {
    //   as: 'next',
    //   foreignKey: 
    // })
  };
  return DistributorLevel;
};