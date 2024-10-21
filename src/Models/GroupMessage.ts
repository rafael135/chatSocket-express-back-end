import { DataTypes, Model } from "sequelize";
import { mariaDb as sequelize } from "../Instances/MariaDB";
import { User, UserInstance } from "./User";
import { MessageImageType } from "../Services/WebSocket";
import Group from "./Group";

export interface GroupMessageInstance extends Model {
    uuid: string;
    fromUserUuid: string;
    user: UserInstance;
    toGroupUuid: string;
    imageUuid: string | null;
    imgs: MessageImageType[];
    type: "new-user" | "exit-user" | "msg" | "img" | "error";
    body: string;
    createdAt: string;
    updatedAt: string;
}

const GroupMessage = sequelize.define<GroupMessageInstance>("GroupMessage", {
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
    toGroupUuid: {
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

GroupMessage.belongsTo(User, {
    foreignKey: "fromUserUuid"
});

GroupMessage.belongsTo(Group, {
    foreignKey: "toGroupUuid"
});

export default GroupMessage;