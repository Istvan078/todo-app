export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmedPassword?: string;
  avatarUrl?: string;
  avatarPublicId?: string;
}

export interface IUserWithIdAndCreds
  extends Pick<IUser, 'email' | 'password'> {
  _id?: string;
  token?: string;
}

export interface IUserCredentials
  extends Pick<
    IUser,
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'avatarUrl'
    | 'avatarPublicId'
  > {
  _id: string;
  token?: string;
}
