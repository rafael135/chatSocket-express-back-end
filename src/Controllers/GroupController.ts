import { Request, Response } from "express";
import { User } from "../Models/User";
import GroupService from "../Services/GroupService";
import { DELETE, GET, POST, before, route } from "awilix-express";
import checkToken from "../Middlewares/Auth";
import AuthService from "../Services/AuthService";
import GroupAdmin from "../Models/GroupAdmin";
import UserGroupFacade from "../Facades/UserGroupFacade";


@route("/api/group")
class GroupController {
    private readonly _authService: AuthService;
    private readonly _groupService: GroupService;
    private readonly _userGroupFacade: UserGroupFacade;

    constructor(authService: AuthService, groupService: GroupService, userGroupFacade: UserGroupFacade) {
        this._authService = authService;
        this._groupService = groupService;
        this._userGroupFacade = userGroupFacade;
    }

    @route("/:groupUuid/members")
    @GET()
    public async getGroupMembers(req: Request, res: Response) {
        let { groupUuid } = req.params as { groupUuid: string | null };

        if(groupUuid == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        let members = await this._groupService.getGroupMembers(groupUuid);

        res.status(200);
        return res.send({
            groupMembers: members,
            status: 200
        });
    }

    @route("/")
    @POST()
    @before(checkToken)
    public async createNewGroup(req: Request, res: Response) {
        let { groupName } = req.body as { groupName: string | null };

        if (groupName == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        let authCookie = req.cookies.auth_session as string;

        let response = await this._userGroupFacade.createGroup(authCookie, groupName);

        if(response.status == 201) {
            res.status(201);
            return res.send({
                group: response.group!,
                status: 201
            });
        } else {
            res.status(500);
            return res.send({
                status: 500
            });
        }
        
    }

    @route("/:groupUuid/invite/:userUuid")
    @POST()
    @before(checkToken)
    public async inviteUserToGroup(req: Request, res: Response) {
        let { groupUuid, userUuid } = req.params as { groupUuid: string | null, userUuid: string | null };

        if(groupUuid == null || userUuid == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        let authCookie = req.cookies.auth_session as string;

        let invitationResponse = await this._userGroupFacade.inviteUserToGroup(authCookie, userUuid, groupUuid);

        if(invitationResponse.status == 400) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        res.status(201);
        return res.send(invitationResponse);
    }

    @route("/:groupUuid/exit")
    @DELETE()
    @before(checkToken)
    public async exitFromGroup(req: Request, res: Response) {
        let { groupUuid } = req.params as { groupUuid: string | null };

        if(groupUuid == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        let authCookie = req.cookies.auth_session as string;

        let loggedUser = await this._authService.getLoggedUser(authCookie);

        if(loggedUser == null) {
            res.status(403);
            return res.send({
                status: 403
            });
        }

        let success = await this._groupService.removeMemberFromGroup(groupUuid, loggedUser.uuid);

        if(success == false) {
            res.status(406);
            return res.send({
                status: 406
            });
        }

        res.status(200);
        return res.send({
            status: 200
        });
    }


    // Facade:
    @route("/")
    @DELETE()
    @before(checkToken)
    public async removeUserFromGroups(req: Request, res: Response) {
        let { group_ids } = req.body as { group_ids: string[] | null };
        
        let authCookie = req.cookies.auth_session as string;

        let result = await this._userGroupFacade.removeUserFromGroup(authCookie, group_ids);

        res.status(result.status);
        return res.send({
            status: result.status
        });

    }


    @route("/:groupUuid/admin/:userUuid")
    @GET()
    @before(checkToken)
    public async isUserGroupAdmin(req: Request, res: Response) {
        let { userUuid, groupUuid } = req.params as { userUuid: string | null, groupUuid: string | null };

        if(userUuid == null || groupUuid == null) {
            res.status(400);
            return res.send({
                isAdmin: false,
                status: 400
            });
        }

        let authCookie = req.cookies.auth_session as string;

        let response = this._userGroupFacade.isUserGroupAdmin(authCookie, userUuid, groupUuid);

        return res.send(response);
    }
}

export default GroupController;