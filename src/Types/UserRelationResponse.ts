
export type UserFriend = {
    uuid: string;
    isFriend?: boolean;
    isPending?: boolean;
    avatarSrc?: string;
    name: string;
    nickName: string;
    email: string;
    createdAt: string;
    updatedAt: string;
};


export type FriendResponse = {
    uuid: string;
    avatarSrc?: string;
    name: string;
    nickName: string;
    email: string;
}

export type FriendRelationResponse = {
    isPending: boolean;
    isfriend: boolean;
}

export type UserAddFriendResponse = {
    status: number;
    friend?: FriendResponse | FriendRelationResponse;
}




export type GetUserPendingFriendsResponse = {
    status: number;
    pendingFriends?: UserFriend[];
}