'use strict';
module.exports = (sequelize, DataTypes) => {
  const AdminNews = sequelize.define('AdminNews', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    message: {
      type: DataTypes.STRING
    },
    isLatest: {
      type: DataTypes.BOOLEAN
    }
  }, {});
  AdminNews.associate = function(models) {
    // associations can be defined here
  };
  return AdminNews;
};