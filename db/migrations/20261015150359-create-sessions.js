'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sessions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      host_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'hosts',
          key: 'id'
        },
        onDelete: 'CASCADE'
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
      code: {
        type: Sequelize.STRING(6),
        allowNull: false,
        unique: true
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'waiting'
      },
      current_question: {
        type: Sequelize.INTEGER
      },
      round_winner_id: {
        type: Sequelize.INTEGER
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
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
    await queryInterface.dropTable('sessions');
  }
};