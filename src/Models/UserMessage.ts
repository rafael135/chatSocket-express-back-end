import { DataTypes, Model } from "sequelize";
import { mariaDb as sequelize } from "../Instances/MariaDB";
import { User, UserInstance } from "./User";
import { MessageImageType } from "../Services/WebSocket";
import IMessage from "./Interfaces/IMessage";


export interface UserMessageInstance extends Model, IMessage {
    user?: UserInstance;
}

const UserMessage = sequelize.define<UserMessageInstance>("UserMessage", {
    uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
    },
    fromUserUuid: {
        type: DataTypes.UUID,
        allowNull: false
    },
    toUuid: {
        type: DataTypes.UUID,
        allowNull: false
    },
    imageUuid: {
        type: DataTypes.UUID,
        allowNull: true
    },
    imgs: {
        type: DataTypes.VIRTUAL,
        defaultValue: []
    },
    type: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    body: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false,
        defaultValue: ""
    }
}, {
    timestamps: true
});


UserMessage.belongsTo(User, {
    foreignKey: "fromUserUuid",
    targetKey: "id"
});

UserMessage.hasOne(User, {
    foreignKey: "id",
    sourceKey: "toUuid"
})

export default UserMessage;