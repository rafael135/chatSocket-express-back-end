import { GroupInstance } from "../Models/Group";
import GroupAdmin from "../Models/GroupAdmin";
import { GroupInvitationInstance } from "../Models/GroupInvitation";
import AuthService from "../Services/AuthService";
import GroupService from "../Services/GroupService";


class UserGroupFacade {
    private readonly _authService: AuthService;
    private readonly _groupService: GroupService;

    constructor(authService: AuthService, groupService: GroupService) {
        this._authService = authService;
        this._groupService = groupService;
    }

    public async createGroup(authCookie: string, groupName: string): Promise<{ status: number, group?: GroupInstance }> {
        let loggedUser = await this._authService.getLoggedUser(authCookie)

        if(loggedUser == null) {
            return {
                status: 401
            };
        }

        let createdGroup = await this._groupService.newGroup(groupName, loggedUser.uuid);

        if(createdGroup == null) {
            return {
                status: 500
            };
        }

        return {
            group: createdGroup,
            status: 201
        };


    }

    public async inviteUserToGroup(authCookie: string, userUuid: string, groupUuid: string): Promise<{ status: number, groupInvitation?: GroupInvitationInstance }> {
        const loggedUser = await this._authService.getLoggedUser(authCookie);

        if(loggedUser == null) {
            return { status: 403 };
        }

        const invitation = await this._groupService.inviteUserToGroup(groupUuid, userUuid);

        if(invitation == null) {
            return {
                status: 400
            };
        }

        return {
            status: 201,
            groupInvitation: invitation
        };
    }

    public async isUserGroupAdmin(authCookie: string, userUuid: string, groupUuid: string): Promise<{ status: number, isAdmin: boolean }> {
        let loggedUser = await this._authService.getLoggedUser(authCookie);

        if(loggedUser == null) {
            return {
                isAdmin: false,
                status: 403
            };
        }

        let groupAdmin = await GroupAdmin.findOne({
            where: {
                groupUuid: groupUuid,
                userUuid: userUuid
            }
        });

        if(groupAdmin == null) {
            return {
                isAdmin: false,
                status: 200
            };
        }

        return {
            isAdmin: true,
            status: 200
        };
    }

    public async removeUserFromGroup(authCookie: string, groupIds: string[] | null): Promise<{ status: number }> {
        const loggedUser = await this._authService.getLoggedUser(authCookie);

        if(loggedUser == null) {
            return { status: 403 };
        }

        if(groupIds == null || groupIds.length == 0) {
            return { status: 400 };
        }

        let promises: Promise<boolean>[] = []

        for(const groupId of groupIds) {
            promises.push(this._groupService.removeMemberFromGroup(groupId, loggedUser.uuid));
        }

        let results = await Promise.all(promises);

        if(results.find(r => r == false)) {
            return { status: 401 };
        }

        return { status: 200 };
    }

}

export default UserGroupFacade;