import { DataTypes, Model } from "sequelize";
import { mariaDb as sequelize } from "../Instances/MariaDB";
import Group from "./Group";
import { User } from "./User";

export interface GroupAdminInstance extends Model {
    uuid: string;
    userUuid: string;
    groupUuid: string;
    createdAt: string;
    updatedAt: string;
};

const GroupAdmin = sequelize.define<GroupAdminInstance>("GroupAdmin", {
    uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
    },
    userUuid: {
        type: DataTypes.UUID,
        allowNull: false
    },
    groupUuid: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    timestamps: true
});

GroupAdmin.belongsTo(Group, {
    foreignKey: "groupUuid"
});

GroupAdmin.belongsTo(User, {
    foreignKey: "userUuid"
});

export default GroupAdmin;