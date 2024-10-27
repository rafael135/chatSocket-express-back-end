import { User } from "../Models/User";
import { UserRelationInstance } from "../Models/UserRelation";
import AuthService from "../Services/AuthService";
import FriendService from "../Services/FriendService";
import { GetUserPendingFriendsResponse, UserAddFriendResponse } from "../Types/UserRelationResponse";





class UserRelationFacade {
    private readonly _authService: AuthService;
    private readonly _friendService: FriendService;

    constructor(authService: AuthService, friendService: FriendService) {
        this._authService = authService;
        this._friendService = friendService;
    }

    public async addFriend(authCookie: string, userUuid: string): Promise<UserAddFriendResponse> {
        let loggedUser = await this._authService.getLoggedUser(authCookie);

        if(loggedUser == null) {
            return {
                status: 401
            };
        }

        let friendRelation = await this._friendService.addOrRemoveFriend(loggedUser.uuid, userUuid);


        if(friendRelation.isFriend == false && friendRelation.isPending == true) {
            return {
                friend: {
                    isPending: true,
                    isfriend: false
                },
                status: 200
            };
        } else if(friendRelation.isFriend == false && friendRelation.isPending == false) {
            return {
                friend: {
                    isPending: false,
                    isfriend: false
                },
                status: 200
            };
        }

        let friend = (await User.findOne({
            where: {
                uuid: friendRelation.friend!.toUserUuid
            }
        }))!;

        return {
            status: 201,
            friend: {
                uuid: friend.uuid,
                name: friend.name,
                nickName: friend.nickName,
                email: friend.email,
                avatarSrc: friend.avatarSrc
            }
        }
    }

    
    public async getPendingFriends(authCookie: string): Promise<GetUserPendingFriendsResponse> {
        let loggedUser = await this._authService.getLoggedUser(authCookie);

        if(loggedUser == null) {
            return {
                status: 401
            };
        }

        let pendingFriends = await this._friendService.getPendingFriends(loggedUser.uuid);

        return {
            status: 200,
            pendingFriends: pendingFriends
        };
    }
}


export default UserRelationFacade;