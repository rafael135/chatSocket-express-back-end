import { DataTypes, Model } from "sequelize";
import { mariaDb as sequelize } from "../Instances/MariaDB";
import { Group } from "./Group";
import { User } from "./User";


export interface GroupInvitationInstance extends Model {
    uuid: string;
    groupUuid: string;
    userUuid: string;
    createdAt: string;
    updatedAt: string;
}

export const GroupInvitation = sequelize.define<GroupInvitationInstance>("GroupInvitation", {
    uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
    },
    groupUuid: {
        type: DataTypes.UUID,
        allowNull: false
    },
    userUuid: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: "groupInvitations"
});

GroupInvitation.belongsTo(Group, {
    foreignKey: "groupUuid",
    targetKey: "uuid"
});

GroupInvitation.hasOne(User, {
    foreignKey: "id",
    sourceKey: "userUuid"
});

export default GroupInvitation;