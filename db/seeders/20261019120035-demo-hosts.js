'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Insert Demo Users
    await queryInterface.bulkInsert('users', [
      {
        school_id: 'HOST-001',
        full_name: 'Primary Host User',
        email: 'host1@quizludo.edu',
        role: 'HOST',
        created_at: new Date(),
      },
      {
        school_id: 'HOST-002',
        full_name: 'Second Host User',
        email: 'host2@quizludo.edu',
        role: 'HOST',
        created_at: new Date(),
      },
    ], {});

    // Fetch inserted user IDs
    const users = await queryInterface.sequelize.query(
      `SELECT user_id FROM users WHERE school_id IN ('HOST-001', 'HOST-002') ORDER BY user_id ASC;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (users.length >= 2) {
      // 2. Insert Demo Hosts
      await queryInterface.bulkInsert('hosts', [
        { user_id: users[0].user_id, created_at: new Date() },
        { user_id: users[1].user_id, created_at: new Date() },
      ], {});

      // 3. Insert Demo Question Set
      await queryInterface.bulkInsert('question_sets', [
        {
          host_id: users[0].user_id,
          title: 'CS Fundamentals Quiz',
          subject: 'Computer Science',
          is_public: true,
          created_at: new Date(),
        },
      ], {});

      // Fetch inserted set ID
      const questionSets = await queryInterface.sequelize.query(
        `SELECT set_id FROM question_sets LIMIT 1;`,
        { type: Sequelize.QueryTypes.SELECT }
      );

      if (questionSets.length > 0) {
        const set_id = questionSets[0].set_id;

        // 4. Insert Demo Questions
        await queryInterface.bulkInsert('questions', [
          {
            set_id: set_id,
            question_text: 'What does CPU stand for?',
            option_a: 'Central Processing Unit',
            option_b: 'Computer Personal Unit',
            option_c: 'Central Processor Utility',
            option_d: 'Control Processing Unit',
            correct_answer: 'A',
            created_at: new Date(),
          },
        ], {});
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('questions', null, {});
    await queryInterface.bulkDelete('question_sets', null, {});
    await queryInterface.bulkDelete('hosts', null, {});
    await queryInterface.bulkDelete('users', null, {});
  },
};