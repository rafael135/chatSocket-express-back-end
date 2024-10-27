import { Op } from "sequelize";
import GroupMessage from "../Models/GroupMessage";
import { MessageImage, MessageImageInstance } from "../Models/MessageImage";
import { User, UserInstance } from "../Models/User";
import UserMessage, { UserMessageInstance } from "../Models/UserMessage";
import MessageImageService from "./MessageImageService";
import { MessageImageType, MessageType, onUserGroupMsgType, onUserPrivateMsgType } from "./WebSocket";
import ConcreteMessageFactory from "../Factories/ConcreteMessageFactory";


type MessageObjectType = {
    uuid: string;
    fromUserUuid: string;
    toUuid: string;
    imageUuid: string | null;
    type: "new-user" | "exit-user" | "msg" | "img" | "error";
    body: string;
    imgs: MessageImageType[];
    createdAt: string;
    updatedAt: string;
}
class MessageService {
    private readonly _messageImageService: MessageImageService;
    private readonly _concreteMessageFactory: ConcreteMessageFactory;

    constructor(messageImageService: MessageImageService, concreteMessageFactory: ConcreteMessageFactory) {
        this._messageImageService = messageImageService;
        this._concreteMessageFactory = concreteMessageFactory;
    }

    public async saveGroupMessage(author: UserInstance, msgData: onUserGroupMsgType): Promise<MessageObjectType | null> {
        let imgs = msgData.imgs;

        let messageImages: MessageImageInstance[] = [];
        let socketImgs: MessageImageType[] = [];

        if (imgs.length > 0) {
            messageImages = await this._messageImageService.createMessageImages(imgs);
            socketImgs = await this._messageImageService.messageImagesToSocketImages(author, messageImages);
        }


        // Abstract Factory:
        let message = await this._concreteMessageFactory.createGroupMessage(
            author.uuid,
            msgData.groupUuid,
            msgData.msg,
            msgData.type,
            (messageImages.length > 0) ? messageImages[0].uuid : null,
        );

        //message.imgs = socketImgs;

        let messageObject: MessageObjectType = {
            uuid: message.uuid,
            fromUserUuid: message.fromUserUuid,
            toUuid: message.toUuid,
            imageUuid: message.imageUuid,
            type: message.type,
            body: message.body,
            imgs: socketImgs,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt
        };

        return messageObject;
    }

    public async savePrivateUserMessage(author: UserInstance, msgData: onUserPrivateMsgType): Promise<UserMessageInstance | null> {
        let imgs = msgData.imgs;

        let messageImages: MessageImageInstance[] = [];
        let socketImgs: MessageImageType[] = [];

        if (imgs.length > 0) {
            messageImages = await this._messageImageService.createMessageImages(imgs);
            socketImgs = await this._messageImageService.messageImagesToSocketImages(author, messageImages);
        }
        
        // Abstract Factory:
        let message = await this._concreteMessageFactory.createUserMessage(
            author.uuid,
            msgData.userUuid,
            msgData.msg,
            msgData.type,
            (messageImages.length > 0) ? messageImages[0].uuid : null,
        )

        message.imgs = socketImgs;

        return message;
    }

    private sortMessages(messages: MessageType[]) {
        let sortedMessages = messages.sort((a, b) => {
            let dateA = new Date(a.time!).getTime();
            let dateB = new Date(b.time!).getTime();

            if (dateA > dateB) {
                return 1;
            } else if (dateA < dateB) {
                return -1;
            } else {
                return 0;
            }
        });

        return sortedMessages;
    }

    public async getUserMessages(userUuid: string) {
        let userMessages = await UserMessage.findAll({
            where: {
                [Op.or]: [
                    { fromUserUuid: userUuid },
                    { toUuid: userUuid }
                ]
            },
            order: [
                ["createdAt", "ASC"]
            ]
        });

        let messages: MessageType[] = [];

        await new Promise<void>((resolve) => {
            let count = 0;

            userMessages.forEach(async (msg) => {
                let author = (await User.findOne({ where: { uuid: msg.fromUserUuid } }))!;
                author.password = undefined;
                author.id = undefined;

                let imgs: MessageImageType[] = [];

                if (msg.imageUuid != null) {
                    imgs = await this._messageImageService.getUserMessageImages(author, msg);
                }

                messages.push({
                    author: author,
                    type: msg.type,
                    msg: msg.body,
                    imgs: imgs,
                    to: "user",
                    toUuid: msg.toUuid,
                    time: msg.createdAt
                });

                count++;

                if (count == userMessages.length) { resolve(); }
            });

            if (count == userMessages.length) { resolve(); }
        });

        messages = this.sortMessages(messages);

        return messages;
    }

    public async getGroupMessages(groupUuid: string) {
        let groupMessages = await GroupMessage.findAll({
            where: {
                toGroupUuid: groupUuid
            },
            order: [
                ["createdAt", "ASC"]
            ]
        });

        let messages: MessageType[] = [];

        await new Promise<void>((resolve) => {
            let count = 0;

            groupMessages.forEach(async (msg) => {
                let author = (await User.findOne({ where: { uuid: msg.fromUserUuid } }))!;
                author.password = undefined;
                author.id = undefined;

                let imgs: MessageImageType[] = [];

                if (msg.imageUuid != null) {
                    imgs = await this._messageImageService.getGroupMessageImages(author, msg);
                }

                messages.push({
                    author: author,
                    type: msg.type,
                    msg: msg.body,
                    imgs: imgs,
                    to: "group",
                    toUuid: msg.toUuid,
                    time: msg.createdAt
                });

                count++;

                if (count == groupMessages.length) { resolve(); }
            });

            if (count == groupMessages.length) { resolve(); }
        });

        messages = this.sortMessages(messages);

        return messages;
    }
}

export default MessageService;