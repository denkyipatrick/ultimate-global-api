'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('TransferTransactions', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      senderUsername: {
        type: Sequelize.STRING,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        references: {
          key: 'username',
          model: 'Distributors'
        }
      },
      receiverUsername: {
        type: Sequelize.STRING,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        references: {
          key: 'username',
          model: 'Distributors'
        }
      },
      transactionId: {
        type: Sequelize.UUID,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
          key: 'id',
          model: 'WalletTransactions'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('TransferTransactions');
  }
};