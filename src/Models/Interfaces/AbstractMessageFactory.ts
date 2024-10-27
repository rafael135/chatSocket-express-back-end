import { MessageImageType } from "../../Services/WebSocket";
import { GroupMessageInstance } from "../GroupMessage";
import { UserMessageInstance } from "../UserMessage";

// Abstract Factory:
interface AbstractMessageFactory {
    createGroupMessage(fromUserUuid: string, toUuid: string, body: string, type: "new-user" | "exit-user" | "msg" | "img" | "error", imageUuid: string): Promise<GroupMessageInstance>;
    createUserMessage(fromUserUuid: string, toUuid: string, body: string, type: "new-user" | "exit-user" | "msg" | "img" | "error", imageUuid: string): Promise<UserMessageInstance>;
}

export default AbstractMessageFactory;