import { UserRolesEnum } from '../enums/user';

export interface SignUpModel {
  name: string;
  username: string;
  email: string;
  avatar: string;
  password: string;
  role: UserRolesEnum;
}

export interface SignInModel {
  email: string;
  password: string;
}
