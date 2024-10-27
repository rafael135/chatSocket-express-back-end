import { MessageImageType } from "../../Services/WebSocket";




interface IMessage {
    uuid: string;
    fromUserUuid: string;
    toUuid: string;
    body: string;
    type: "new-user" | "exit-user" | "msg" | "img" | "error";
    imageUuid: string | null;
    imgs: MessageImageType[];
    createdAt: string;
    updatedAt: string;
}

export default IMessage;