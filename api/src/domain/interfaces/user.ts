import { UserRolesEnum } from '../enums/user';

export interface IUserModel {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role: UserRolesEnum[];
}
