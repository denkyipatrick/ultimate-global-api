'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   return queryInterface.addColumn('Distributors', 'emailAddress', {
     type: Sequelize.STRING
   })
   .then(() => {
     return queryInterface.addColumn('Distributors', 'phoneNumber', {
       type: Sequelize.STRING
     });
   })
   .then(() => {
    return queryInterface.addColumn('Distributors', 'country', {
      type: Sequelize.STRING
    });
   })
   .then(() => {
    return queryInterface.addColumn('Distributors', 'city', {
      type: Sequelize.STRING
    });
   })
   .then(() => {
    return queryInterface.addColumn('Distributors', 'bankName', {
      type: Sequelize.STRING
    });
   })
   .then(() => {
    return queryInterface.addColumn('Distributors', 'accountNumber', {
      type: Sequelize.STRING
    });
   })
   .then(() => {
    return queryInterface.addColumn('Distributors', 'swiftCode', {
      type: Sequelize.STRING
    });
   })
   .then(() => {
    return queryInterface.addColumn('Distributors', 'nextOfKinName', {
      type: Sequelize.STRING
    });
   });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
      return queryInterface.removeColumn('Distributors', 'emailAddress')
      .then(() => {
        return queryInterface.removeColumn('Distributors', 'phoneNumber');
      })
      .then(() => {
       return queryInterface.removeColumn('Distributors', 'country');
      })
      .then(() => {
       return queryInterface.removeColumn('Distributors', 'city');
      })
      .then(() => {
       return queryInterface.removeColumn('Distributors', 'bankName');
      })
      .then(() => {
       return queryInterface.removeColumn('Distributors', 'accountNumber');
      })
      .then(() => {
       return queryInterface.removeColumn('Distributors', 'swiftCode');
      })
      .then(() => {
       return queryInterface.removeColumn('Distributors', 'nextOfKinName');
      });
  }
};
