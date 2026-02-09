export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IUserWithIdAndCreds
  extends Pick<IUser, 'email' | 'password'> {
  _id?: string;
  token?: string;
}

export interface IUserCredentials
  extends Pick<IUser, 'firstName' | 'lastName' | 'email'> {
  _id: string;
  token?: string;
}
