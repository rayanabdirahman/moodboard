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

  private async isUserGoogleIdInDB(id: string): Promise<boolean> {
    return (await this.userRepository.findOneByGoogleId(id))
      ? Promise.resolve(true)
      : Promise.resolve(false);
  }

  async googleSignUp(model: IGoogleSignUpModel): Promise<any> {
    try {
      // check if user has already signed up
      // return existing user
      if (await this.isUserGoogleIdInDB(model.googleId)) {
        return await this.userRepository.findOneByGoogleId(model.googleId);
      }
      const user = await this.userRepository.createOne(model);
      return user;
    } catch (error: any) {
      if (error?.code === 11000) {
        error.message = `A user with the given credentials exists`;
      }
      logger.error(
        `[AccountService: googleSignUp]: Unabled to create a new user: ${error}`
      );
      throw error;
    }
  }
}
