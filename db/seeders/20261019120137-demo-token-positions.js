'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('token_positions', [
      {
        position_id: 1,
        player_id: 1,
        position: 0,
        updated_at: new Date(),
      },
    ], { ignoreDuplicates: true });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('token_positions', null, {});
  }
};