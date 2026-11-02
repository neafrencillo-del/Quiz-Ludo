'use strict';

module.exports = {
  async up(queryInterface) {
    const db = queryInterface.sequelize;

    // 1. Find the parents that an earlier seeder created (using exact table/column names)
    const [[host]] = await db.query("SELECT user_id FROM users WHERE school_id = '2099-0001';");
    const [[set]] = await db.query("SELECT set_id FROM question_sets WHERE title = 'Library Orientation Basics';");

    // 2. Insert the finished game session
    await queryInterface.bulkInsert('game_sessions', [{
      set_id: set.set_id,
      host_id: host.user_id,
      join_pin: '418263',
      status: 'CLOSED',
      started_at: new Date('2026-10-09T01:00:00Z'),
      ended_at: new Date('2026-10-09T01:12:00Z'),
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // 3. Insert players / game results for this session (at least 3 completed, 1 DNF / left early, 1 tie)
    const [[player1]] = await db.query("SELECT user_id FROM users WHERE school_id = '2099-0002';");
    const [[player2]] = await db.query("SELECT user_id FROM users WHERE school_id = '2099-0003';");
    const [[player3]] = await db.query("SELECT user_id FROM users WHERE school_id = '2099-0004';");
    const [[player4]] = await db.query("SELECT user_id FROM users WHERE school_id = '2099-0005';");

    await queryInterface.bulkInsert('players', [
      {
        session_id: 1, // Or dynamic lookup if needed, matching your session
        user_id: player1.user_id,
        score: 100,
        status: 'COMPLETED', // Winner 1 (Tie)
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        session_id: 1,
        user_id: player2.user_id,
        score: 100, // Awkward case: Tie score
        status: 'COMPLETED', // Winner 2 (Tie)
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        session_id: 1,
        user_id: player3.user_id,
        score: 70,
        status: 'COMPLETED', // Completed player 3
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        session_id: 1,
        user_id: player4.user_id,
        score: 20,
        status: 'LEFT_EARLY', // Unfinished player requirement
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('players', null, {});
    await queryInterface.bulkDelete('game_sessions', { join_pin: '418263' }, {});
  }
};