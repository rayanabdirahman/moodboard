import { AccountRolesEnum } from '../enums/account';

export interface IUserModel {
  _id: string;
  googleId: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role: AccountRolesEnum[];
}
