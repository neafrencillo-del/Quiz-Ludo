'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      set_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'question_sets',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      prompt: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      choices: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      correct_index: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      time_limit_sec: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 15
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('questions');
  }
};