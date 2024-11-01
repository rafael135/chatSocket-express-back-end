'use strict';
const {
  Model, UUID, UUIDV4, TEXT, UUIDV1
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  GroupMessage.init({
    uuid: {
      type: UUID,
      allowNull: false,
      defaultValue: UUIDV1,
      primaryKey: true
    },
    fromUserUuid: {
      type: UUID,
      allowNull: false
    },
    toUuid: {
      type: UUID,
      allowNull: false,
    },
    body: {
      type: TEXT("medium"),
      allowNull: false
    }

  }, {
    sequelize,
    modelName: 'GroupMessage',
  });
  return GroupMessage;
};