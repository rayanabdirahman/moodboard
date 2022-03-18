import { injectable, inject } from 'inversify';
import { SignUpModel } from '../domain/interfaces/account';
import TYPES from '../types';
import logger from '../utilities/logger';

export interface IAccountService {
  signUp(model: SignUpModel): Promise<any>;
}

@injectable()
export class AccountServiceImpl implements IAccountService {
  async signUp(model: SignUpModel): Promise<any> {
    try {
      return await model;
    } catch (error: any) {
      if (error?.code === 11000) {
        error.message = `A user with the given username or email exists`;
      }
      logger.error(
        `[AccountService: signUp]: Unabled to create a new user: ${error}`
      );
      throw error;
    }
  }
}
