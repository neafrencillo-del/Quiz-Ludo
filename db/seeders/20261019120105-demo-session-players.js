'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('session_players', [
      {
        player_id: 1,
        session_id: 1,
        user_id: 1,
        color: 'red',
        joined_at: new Date(),
      },
    ], { ignoreDuplicates: true });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('session_players', null, {});
  }
};