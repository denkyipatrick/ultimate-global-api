'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Distributors', {
      username: {
        primaryKey: true,
        type: Sequelize.STRING
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      sponsorUsername: {
        type: Sequelize.STRING,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        references: {
          key: 'username',
          model: 'Distributors'
        }
      },
      // upLineUsername: {
      //   type: Sequelize.STRING,
      //   onUpdate: 'CASCADE',
      //   onDelete: 'SET NULL',
      //   references: {
      //     key: 'username',
      //     model: 'Distributors'
      //   }
      // },
      distributorLevelId: {
        type: Sequelize.UUID,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        references: {
          key: 'id',
          model: 'DistributorLevels'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.BIGINT,
        defaultValue: new Date().getTime()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.BIGINT,
        defaultValue: new Date().getTime()
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Distributors');
  }
};