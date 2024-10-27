import { Request, Response } from "express";
import { User } from "../Models/User";
import FriendService from "../Services/FriendService";
import UserService from "../Services/UserService";
import { GET, POST, PUT, before, route } from "awilix-express";
import checkToken from "../Middlewares/Auth";
import Group, { GroupInstance } from "../Models/Group";
import GroupRelation from "../Models/GroupRelation";
import AuthService from "../Services/AuthService";
import UserRelationFacade from "../Facades/UserRelationFacade";
import { FriendRelationResponse, FriendResponse } from "../Types/UserRelationResponse";


@route("/api/user")
class UserController {
    private readonly _authService: AuthService;
    private readonly _friendService: FriendService;
    private readonly _userService: UserService;
    private readonly _userRelationFacade: UserRelationFacade;

    constructor(authService: AuthService, friendService: FriendService, userService: UserService, userRelationFacade: UserRelationFacade) {
        this._authService = authService;
        this._friendService = friendService;
        this._userService = userService;
        this._userRelationFacade = userRelationFacade;
    }
    
    @route("/change/avatar")
    @POST()
    @before(checkToken)
    public async changeAvatar(req: Request, res: Response) {
        const { filePath }: { filePath: string | null } = req.body;

        if (filePath == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        let authCookie = req.cookies.auth_session as string;

        let loggedUser = await this._authService.getLoggedUser(authCookie);

        if (loggedUser == null) {
            res.status(401);
            return res.send({
                status: 401
            });
        }

        loggedUser.avatarSrc = filePath;
        await loggedUser.save();

        res.status(201);
        return res.send({
            status: 201
        });
    }

    @route("/change/name")
    @PUT()
    @before(checkToken)
    public async changeName(req: Request, res: Response) {
        const { newName }: { newName: string | null } = req.body;

        //console.log(newName);

        if (newName == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        let authCookie = req.cookies.auth_session as string;

        let loggedUser = await this._authService.getLoggedUser(authCookie);

        if (loggedUser == null) {
            res.status(401);
            return res.send({
                status: 401
            });
        }

        loggedUser.name = newName;

        try {
            await loggedUser.save();
        } catch (err) {
            console.error(err);
            res.status(500);
            return res.send({
                status: 500
            });
        }

        res.status(200);
        return res.send({
            status: 200
        });
    }


    @route("/:userUuid/friends")
    @GET()
    @before(checkToken)
    public async getUserFriends(req: Request, res: Response) {
        let { userUuid } = req.params;

        if (userUuid == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        let authCookie = req.cookies.auth_session as string;

        let loggedUser = await this._authService.getLoggedUser(authCookie);

        if (loggedUser == null) {
            res.status(401);
            return res.send({
                status: 401
            });
        }

        let userFriends = await this._friendService.userFriends(loggedUser.uuid);

        res.status(200);
        return res.send({
            userFriends: userFriends,
            status: 200
        });
    }

    @route("/:userUuid/groups")
    @GET()
    public async getUserGroups(req: Request, res: Response) {
        let { userUuid } = req.params;

        let user = await User.findOne({
            where: {
                uuid: userUuid
            }
        });

        if (user == null) {
            res.status(401);
            return res.send({
                status: 401
            });
        }

        let groupRelations = await GroupRelation.findAll({
            where: {
                userUuid: user.uuid
            }
        });

        let groups = await new Promise<GroupInstance[]>((resolve) => {
            let grs: GroupInstance[] = [];

            groupRelations.forEach(async (groupR) => {
                let group = await Group.findOne({
                    where: {
                        uuid: groupR.groupUuid
                    }
                }) as GroupInstance;

                grs.push(group);

                if (grs.length == groupRelations.length) {
                    resolve(grs);
                }
            });

            if (grs.length == groupRelations.length) { resolve([]); }
        });

        res.status(200);
        return res.send({
            groups: groups,
            status: 200
        });
    }


    @route("/search")
    @GET()
    @before(checkToken)
    public async searchFriends(req: Request, res: Response) {
        let { searchName } = req.query as { searchName: string | null };

        if (searchName == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        let authCookie = req.cookies.auth_session as string;

        let loggedUser = await this._authService.getLoggedUser(authCookie);

        if(loggedUser == null) {
            res.status(401);
            return res.send({
                status: 401
            });
        }

        let users = await this._userService.getUsersByNickName(searchName, loggedUser.uuid);

        res.status(200);
        return res.send({
            users: users,
            status: 200
        });
    }

    @route("/addFriend")
    @POST()
    @before(checkToken)
    public async addFriend(req: Request, res: Response) {
        const { userUuid }: { userUuid: string | null } = req.body;

        if(userUuid == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        let authCookie = req.cookies.auth_session as string;

        // Facade:
        let response = await this._userRelationFacade.addFriend(authCookie, userUuid);

        if(response.status == 401) {
            res.status(400);
            return res.send({
                status: 401
            });
        }

        if(response.status == 200) {
            res.status(200);
            return res.send({
                friend: {
                    isPending: (response.friend as FriendRelationResponse).isPending,
                    isFriend: (response.friend as FriendRelationResponse).isfriend
                },
                status: 200
            })
        }

        res.status(201);
        return res.send({
            friend: (response.friend as FriendResponse),
            status: 201
        });
    }

    @route("/:userUuid/friends/pending")
    @GET()
    @before(checkToken)
    public async getUserPendingFriends(req: Request, res: Response) {
        let { userUuid } = req.params as { userUuid: string | null };

        if(userUuid == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        let authCookie = req.cookies.auth_session as string;

        let response = await this._userRelationFacade.getPendingFriends(authCookie);

        if(response.status == 401) {
            res.status(401);
            return res.send({
                status: 401
            });
        }

        res.status(200);
        return res.send({
            pendingFriends: response.pendingFriends!,
            status: 200
        });
    }

    @route("/:userUuid")
    @GET()
    public async getUserInfo(req: Request, res: Response) {
        let { userUuid } = req.params as { userUuid: string | null };

        if(userUuid == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        let user = await this._userService.getUserInfo(userUuid);

        if(user == null) {
            res.status(404);
            return res.send({
                status: 404
            });
        }

        res.status(200);
        return res.send({
            user: {
                uuid: user.uuid,
                avatarSrc: user.avatarSrc,
                name: user.name,
                nickName: user.nickName,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            status: 200
        });
    }
}

export default UserController;