'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('session_players', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'sessions',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      nickname: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      color: {
        type: Sequelize.STRING(10)
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      is_bot: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      last_seen: {
        type: Sequelize.DATE
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

    // Add unique constraint on two columns as shown in lab guide
    await queryInterface.addConstraint('session_players', {
      type: 'unique',
      name: 'unique_session_nickname',
      fields: ['session_id', 'nickname']
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('session_players');
  }
};