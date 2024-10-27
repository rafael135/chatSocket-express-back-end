import GroupMessage, { GroupMessageInstance } from "../Models/GroupMessage";
import AbstractMessageFactory from "../Models/Interfaces/AbstractMessageFactory";
import UserMessage, { UserMessageInstance } from "../Models/UserMessage";
import { MessageImageType } from "../Services/WebSocket";


// Abstract Factory:
class ConcreteMessageFactory implements AbstractMessageFactory {
    public async createGroupMessage(fromUserUuid: string, toUuid: string, body: string, type: "new-user" | "exit-user" | "msg" | "img" | "error", imageUuid: string | null): Promise<GroupMessageInstance> {
        const groupMessage = await GroupMessage.create({
            fromUserUuid: fromUserUuid,
            toUuid: toUuid,
            body: body,
            type: type,
            imageUuid: imageUuid
        });

        return groupMessage;
    }
    public async createUserMessage(fromUserUuid: string, toUuid: string, body: string, type: "new-user" | "exit-user" | "msg" | "img" | "error", imageUuid: string | null): Promise<UserMessageInstance> {
        const userMessage = await UserMessage.create({
            fromUserUuid: fromUserUuid,
            toUuid: toUuid,
            body: body,
            type: type,
            imageUuid: imageUuid
        });

        return userMessage;
    }
    
}

export default ConcreteMessageFactory;