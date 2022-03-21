import { AccountRolesEnum } from '../enums/account';
import { IUserModel } from './user';

export interface IGoogleSignUpModel {
  googleId: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role?: AccountRolesEnum;
}

export interface IGoogleSignInModel {
  googleId: string;
}

export interface SignUpModel {
  name: string;
  username: string;
  email: string;
  avatar: string;
  password: string;
  role: AccountRolesEnum;
}

export interface SignInModel {
  email: string;
  password: string;
}

export interface IJWTPayload {
  user: IUserModel;
}
