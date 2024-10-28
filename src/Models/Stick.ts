import { DataTypes, Model } from "sequelize";
import { mariaDb as sequelize } from "../Instances/MariaDB";
import { User } from "./User";
import { MessageImageInstance } from "./MessageImage";
import IImage from "./Interfaces/IImage";

export interface Stick extends IImage, Model {
    userUuid: string;
}

const Stick = sequelize.define<Stick>("Stick", {
    uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
    },
    userUuid: {
        type: DataTypes.UUID,
        allowNull: false
    },
    path: {
        type: DataTypes.STRING(255),
        allowNull: false
    }

}, {
    timestamps: true,
});

Stick.belongsTo(User, {
    targetKey: "uuid",
    foreignKey: "userUuid"
});


export default Stick;