'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('sessions', [
      {
        session_id: 1,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], { ignoreDuplicates: true });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('sessions', null, {});
  }
};