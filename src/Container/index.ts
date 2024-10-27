import { AwilixContainer, BuildResolver, DisposableResolver, asClass, createContainer } from "awilix";
import { scopePerRequest } from "awilix-express";
import { Application } from "express";
import TokenService from "../Services/TokenService";
import AuthService from "../Services/AuthService";
import FriendService from "../Services/FriendService";
import UserService from "../Services/UserService";
import MessageImageService from "../Services/MessageImageService";
import MessageService from "../Services/MessageService";
import GroupService from "../Services/GroupService";
import { ImageService } from "../Services/ImageService";
import { StickService } from "../Services/StickService";
import UserGroupFacade from "../Facades/UserGroupFacade";
import UserRelationFacade from "../Facades/UserRelationFacade";
import ConcreteMessageFactory from "../Factories/ConcreteMessageFactory";


/*
interface CustomContainer extends AwilixContainer {
    tokenService: BuildResolver<TokenService> & DisposableResolver<TokenService>;

}
*/


// Abstract Factory:
export const loadContainer = (server: Application) => {
    const Container = createContainer({
        injectionMode: "CLASSIC"
    });

    Container.register({
        imageService: asClass(ImageService).scoped(),
        tokenService: asClass(TokenService).scoped(),
        authService: asClass(AuthService).scoped(),
        friendService: asClass(FriendService).scoped(),
        userRelationFacade: asClass(UserRelationFacade).scoped(),
        groupService: asClass(GroupService).scoped(),
        userService: asClass(UserService).scoped(),
        userGroupFacade: asClass(UserGroupFacade).scoped(),
        stickService: asClass(StickService).scoped(),
        messageImageService: asClass(MessageImageService).scoped(),
        messageService: asClass(MessageService).scoped(),

        concreteMessageFactory: asClass(ConcreteMessageFactory).singleton()
    });

    server.use(scopePerRequest(Container));

    return Container;
}