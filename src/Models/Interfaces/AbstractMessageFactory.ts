import { MessageImageType } from "../../Services/WebSocket";
import { MessageType } from "../../Types/Message";
import { GroupMessageInstance } from "../GroupMessage";
import { UserMessageInstance } from "../UserMessage";

// Abstract Factory:
interface AbstractMessageFactory {
    createGroupMessage(fromUserUuid: string, toUuid: string, body: string, type: MessageType, imageUuid: string): Promise<GroupMessageInstance>;
    createUserMessage(fromUserUuid: string, toUuid: string, body: string, type: MessageType, imageUuid: string): Promise<UserMessageInstance>;
}

export default AbstractMessageFactory;