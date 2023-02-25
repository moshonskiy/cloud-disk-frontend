export interface IUser {
    email: string;
    diskSpace: number;
    userSpace: number;
    files: [],
    _id: string;
    avatar?: null | string;
}

export interface TokenUser {
    user: IUser;
    token: string;
}
