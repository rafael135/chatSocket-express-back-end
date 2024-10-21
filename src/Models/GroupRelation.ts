import { Model, DataTypes } from "sequelize";
import { mariaDb as sequelize } from "../Instances/MariaDB";
import Group from "./Group";
import { User } from "./User";

export interface GroupRelationInstance extends Model {
    uuid: string;
    groupUuid: string;
    userUuid: string;
    createdAt: string;
    updatedAt: string;
}

const GroupRelation = sequelize.define<GroupRelationInstance>("GroupRelation", {
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
    /*
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true
    }*/
}, {
    timestamps: true
});

GroupRelation.belongsTo(Group, {
    foreignKey: "groupUuid"
});

GroupRelation.hasOne(User, {
    foreignKey: "id",
    sourceKey: "userUuid"
});

export default GroupRelation;