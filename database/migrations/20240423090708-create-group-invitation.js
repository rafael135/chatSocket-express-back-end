'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('groupInvitations', {
			uuid: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
				allowNull: false
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
		await queryInterface.dropTable('groupInvitations');
	}
};