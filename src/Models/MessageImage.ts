import { DataTypes, Model } from "sequelize";
import { mariaDb as sequelize } from "../Instances/MariaDB";
import IImage from "./Interfaces/IImage";

export interface MessageImageInstance extends IImage, Model {
    nextImageUuid: string | null;
}

export const MessageImage = sequelize.define<MessageImageInstance>("MessageImage", {
    uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
    },
    nextImageUuid: {
        type: DataTypes.UUID,
        allowNull: true
    },
    path: {
        type: DataTypes.STRING(255),
        allowNull: false
    }

}, {
    timestamps: true,
});