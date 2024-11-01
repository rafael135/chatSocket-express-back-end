'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GroupRelations', {
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
      },
      groupUuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Groups",
          key: "uuid"
        },
        onDelete: "CASCADE"
      },
      userUuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "uuid",
        },
        onDelete: "CASCADE"
      },
      /*
      isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: true
      },*/
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
    await queryInterface.dropTable('GroupRelations');
  }
};