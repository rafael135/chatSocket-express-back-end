import { DataTypes, Model } from "sequelize";
import { mariaDb as sequelize } from "../Instances/MariaDB";
import { User, UserInstance } from "./User";


export interface UserRelationInstance extends Model {
    uuid: string;
    user?: UserInstance;
    fromUserUuid: string;
    toUserUuid: string;
    createdAt: string;
    updatedAt: string;
}

const UserRelation = sequelize.define<UserRelationInstance>("UserRelation", {
    uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
    },
    fromUserUuid: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    toUserUuid: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    timestamps: true
});


UserRelation.belongsTo(User, {
    foreignKey: "fromUserUuid"
});

UserRelation.hasOne(User, {
    foreignKey: "uuid",
    sourceKey: "toUserUuid"
});

export default UserRelation;