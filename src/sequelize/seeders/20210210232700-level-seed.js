'use strict';

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
   return queryInterface.bulkInsert('DistributorLevels', [
      { 
        id: 'starter_stage_1', 
        name: "Starter", 
        number: 1,
        incentiveAmount: 1,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime()
      },
      { 
        id: 'leader_stage_2', 
        name: "Leader", 
        number: 2,
        incentiveAmount: 2,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime()
      },
      { 
        id: 'ruby_stage_3', 
        name: "Ruby", 
        number: 3,
        incentiveAmount: 15,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime()
      },
      { 
        id: 'emerald_stage_4', 
        name: "Emerald", 
        number: 4,
        incentiveAmount: 60,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime()
      },
      { 
        id: 'diamond_stage_5', 
        name: "Diamond", 
        number: 5,
        incentiveAmount: 260,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime()
      },
      { 
        id: 'crown_diamond_stage_6', 
        name: "Crown Diamond", 
        number: 6,
        incentiveAmount: 850,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime()
      },
      { 
        id: 'double_crown_diamond_stage_7', 
        name: "Double Crown Diamond", 
        number: 7,
        incentiveAmount: 4250,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime()
      },
      { 
        id: 'super_crown_diamond_stage_8', 
        name: "Super Crown Diamond", 
        number: 8,
        incentiveAmount: 22000,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime()
      },
      { 
        id: 'infinity_stage_9', 
        name: "Infinity", 
        number: 9,
        incentiveAmount: 22000,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime()
      }
   ])
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('DistributorLevels', null, {});
  }
};
