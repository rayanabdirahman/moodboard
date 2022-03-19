import { AccountRolesEnum } from '../enums/account';

export interface IGoogleSignUpModel {
  googleId: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role?: AccountRolesEnum;
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
