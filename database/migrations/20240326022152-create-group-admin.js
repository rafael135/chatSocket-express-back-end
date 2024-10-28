'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GroupAdmins', {
      uuid: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        type: Sequelize.UUID
      },
      groupUuid: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "Groups",
          key: "uuid"
        },
        onDelete: "CASCADE"
      },
      userUuid: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "Users",
          key: "uuid"
        },
        onDelete: "CASCADE"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('GroupAdmins');
  }
};