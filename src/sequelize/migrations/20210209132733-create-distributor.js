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
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: new Date()
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Distributors');
  }
};