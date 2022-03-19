import { injectable, inject } from 'inversify';
import { IUserRepository } from '../database/repositories/user.repository';
import { IGoogleSignUpModel, SignUpModel } from '../domain/interfaces/account';
import TYPES from '../types';
import logger from '../utilities/logger';

export interface IAccountService {
  googleSignUp(model: IGoogleSignUpModel): Promise<any>;
}

@injectable()
export class AccountServiceImpl implements IAccountService {
  private userRepository: IUserRepository;

  constructor(@inject(TYPES.UserRepository) userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async googleSignUp(model: IGoogleSignUpModel): Promise<any> {
    try {
      const user = await this.userRepository.createOne(model);
      return user;
    } catch (error: any) {
      if (error?.code === 11000) {
        error.message = `A user with the given username or email exists`;
      }
      logger.error(
        `[AccountService: googleSignUp]: Unabled to create a new user: ${error}`
      );
      throw error;
    }
  }
}
