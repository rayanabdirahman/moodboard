import { AccountRolesEnum } from '../enums/account';

export interface IUserModel {
  _id: string;
  googleId?: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  avatar: string;
  gender: string;
  birth_year: number;
  birth_month: number;
  birth_day: number;
  verified: boolean;
  search: string[];
  role: AccountRolesEnum[];
}
