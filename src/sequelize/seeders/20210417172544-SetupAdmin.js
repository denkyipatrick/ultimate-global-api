'use strict';

const FIRST_ACCOUNT_USERNAME = 'admin';
const bcryptjs = require('bcryptjs');

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

   return queryInterface.bulkInsert('Distributors', [
     { 
       username: FIRST_ACCOUNT_USERNAME,
       lastName: 'Account',
       firstName: 'Main Admin',
       password: bcryptjs.hashSync('password', 10)
    }
   ])
   .then(() => {
     return queryInterface.bulkInsert('DistributorWallets', [
       {
         id: 'admin_wallet',
         balance: 1000,
         distributorUsername: FIRST_ACCOUNT_USERNAME
       }
     ]);
   })
   .then(() => {
    return queryInterface.bulkInsert('DistributorLevelGenerations', [
      {
        id: 'admin_starter_level',
        username: FIRST_ACCOUNT_USERNAME,
        position: 'none',
        levelId: 'starter_stage_1',
      },
      {
        id: 'admin_leader_level',
        username: FIRST_ACCOUNT_USERNAME,
        position: 'none',
        levelId: 'leader_stage_2',
      },
      {
        id: 'admin_ruby_level',
        username: FIRST_ACCOUNT_USERNAME,
        position: 'none',
        levelId: 'ruby_stage_3',
      },
      {
        id: 'admin_emerald_level',
        username: FIRST_ACCOUNT_USERNAME,
        position: 'none',
        levelId: 'emerald_stage_4',
      },
      {
        id: 'admin_diamond_level',
        username: FIRST_ACCOUNT_USERNAME,
        position: 'none',
        levelId: 'diamond_stage_5',
      },
      {
        id: 'admin_crown_diamond_level',
        username: FIRST_ACCOUNT_USERNAME,
        position: 'none',
        levelId: 'crown_diamond_stage_6',
      },
      {
        id: 'admin_double_crown_diamond_level',
        username: FIRST_ACCOUNT_USERNAME,
        position: 'none',
        levelId: 'double_crown_diamond_stage_7',
      },
      {
        id: 'admin_super_crown_diamond_level',
        username: FIRST_ACCOUNT_USERNAME,
        position: 'none',
        levelId: 'super_crown_diamond_stage_8',
      },
      {
        id: 'admin_infinity_level',
        username: FIRST_ACCOUNT_USERNAME,
        position: 'none',
        levelId: 'infinity_stage_9',
      }
    ]);
   })
   .then(() => {
     return queryInterface.bulkUpdate('Distributors', {
       distributorLevelId: 'infinity_stage_9'
     }, { username: FIRST_ACCOUNT_USERNAME }
     );
   })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('DistributorLevelGenerations', 
     { username: FIRST_ACCOUNT_USERNAME }
   )
   .then(() => {
     return queryInterface.bulkDelete('Distributors', 
        { username: FIRST_ACCOUNT_USERNAME }
     );
   });
  }
};
