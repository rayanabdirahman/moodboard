import { injectable, inject } from 'inversify';
import { IUserDocument } from '../database/models/user.model';
import { IUserRepository } from '../database/repositories/user.repository';
import {
  IGoogleSignUpModel,
  IJWTPayload,
  SignUpModel
} from '../domain/interfaces/account';
import TYPES from '../types';
import JWTHelper from '../utilities/jwtHelper';
import logger from '../utilities/logger';

export interface IAccountService {
  googleSignUp(model: IGoogleSignUpModel): Promise<any>;
  refreshAccessToken(refreshToken: string): Promise<any>;
}

@injectable()
export class AccountServiceImpl implements IAccountService {
  private userRepository: IUserRepository;

  constructor(@inject(TYPES.UserRepository) userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  private async isUserGoogleIdInDB(id: string): Promise<IUserDocument | null> {
    const user = await this.userRepository.findOneByGoogleId(id);
    return user ? user : null;
  }

  async googleSignUp(model: IGoogleSignUpModel): Promise<any> {
    try {
      // check if user has already signed up
      const existingUser = await this.isUserGoogleIdInDB(model.googleId);
      if (existingUser) {
        const { refreshToken, ...user } = existingUser.toJSON();

        // sign JWT access token
        const accessToken = await JWTHelper.signAccessToken(
          user as IUserDocument
        );

        return { user, accessToken, refreshToken };
      }

      // create new user
      const user = await this.userRepository.createOne(model);

      // create JWT refresh token for user
      const refreshToken = await JWTHelper.signRefreshToken(user);

      // save refresh token to DB for user
      await this.userRepository.findOneByIdAndUpdate(user._id, {
        refreshToken
      });

      // sign JWT access token
      const accessToken = await JWTHelper.signAccessToken(user);

      return { user, accessToken, refreshToken };
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

  async refreshAccessToken(refreshToken: string): Promise<any> {
    try {
      const user = await this.userRepository.findOneByRefreshToken(
        refreshToken
      );
      if (!user) {
        throw new Error('User with given refresh token does not exist');
      }

      // verify refresh token
      const decoded: IJWTPayload = await JWTHelper.decodeRefreshToken(
        refreshToken
      );
      if (!decoded) {
        throw new Error(decoded);
      }

      // sign JWT access token
      const accessToken = await JWTHelper.signAccessToken(user);

      return { user, accessToken, refreshToken };
    } catch (error: any) {
      if (error?.code === 11000) {
        error.message = `A user with the given credentials exists`;
      }
      logger.error(
        `[AccountService: refreshAccessToken]: Unable to create new user access token: ${error}`
      );
      throw error;
    }
  }
}
