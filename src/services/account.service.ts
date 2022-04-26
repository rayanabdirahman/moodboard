import { injectable, inject } from 'inversify';
import { IUserDocument } from '../database/models/user.model';
import { IUserRepository } from '../database/repositories/user.repository';
import {
  IGoogleSignInModel,
  IGoogleSignUpModel,
  IJWTPayload,
  ISignUpModel
} from '../domain/interfaces/account';
import TYPES from '../types';
import JWTHelper from '../utilities/jwtHelper';
import logger from '../utilities/logger';

export interface IAccountService {
  googleSignUp(model: IGoogleSignUpModel): Promise<any>;
  googleSignIn(model: IGoogleSignInModel): Promise<any>;
  signUp(model: ISignUpModel): Promise<any>;
  signOut(refreshToken: string): Promise<any>;
  isRefreshTokenInDB(refreshToken: string): Promise<any>;
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

  async isRefreshTokenInDB(
    refreshToken: string
  ): Promise<IUserDocument | null> {
    const user = await this.userRepository.findOneByRefreshToken(refreshToken);
    return user ? user : null;
  }

  async googleSignUp(model: IGoogleSignUpModel): Promise<any> {
    try {
      // check if user has already signed up
      const existingUser = await this.isUserGoogleIdInDB(model.googleId);
      // if (existingUser) {
      //   const { refreshToken, ...user } = existingUser.toJSON();

      //   // sign JWT access token
      //   const accessToken = await JWTHelper.signAccessToken(
      //     user as IUserDocument
      //   );

      //   return { user, accessToken, refreshToken };
      // }

      // create new user
      const user = await this.userRepository.createOne(model);

      // build access and refresh tokens
      const { accessToken, refreshToken } = await JWTHelper.buildTokens(user);

      // save refresh token to DB for user
      const updatedUser = await this.userRepository.findOneByIdAndUpdate(
        user._id,
        {
          refreshToken
        }
      );

      return { user: updatedUser, accessToken, refreshToken };
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

  async googleSignIn(model: IGoogleSignInModel): Promise<any> {
    try {
      // check if user exists
      const userInDB = await this.isUserGoogleIdInDB(model.googleId);
      if (!userInDB) {
        throw new Error(
          'User with given credentials does not exist. Please sign up'
        );
      }

      // // create JWT refresh token for user
      // const refreshToken = await JWTHelper.signRefreshToken(userInDB);

      // build access and refresh tokens
      const { accessToken, refreshToken } = await JWTHelper.buildTokens(
        userInDB
      );

      // save refresh token to DB for user
      const updatedUser = await this.userRepository.findOneByIdAndUpdate(
        userInDB._id,
        {
          refreshToken
        }
      );

      // sign JWT access token
      // const accessToken = await JWTHelper.signAccessToken(
      //   updatedUser as IUserDocument
      // );

      return { user: updatedUser, accessToken, refreshToken };
    } catch (error: any) {
      logger.error(
        `[AccountService: googleSignIn]: Unabled to sign in user: ${error}`
      );
      throw error;
    }
  }

  async signUp(model: ISignUpModel): Promise<any> {
    try {
      // create new user
      const user = await this.userRepository.createOne(model);

      // build access and refresh tokens
      const { accessToken, refreshToken } = await JWTHelper.buildTokens(user);

      // save refresh token to DB for user
      const updatedUser = await this.userRepository.findOneByIdAndUpdate(
        user._id,
        {
          refreshToken
        }
      );

      return { user: updatedUser, accessToken, refreshToken };
    } catch (error: any) {
      if (error?.code === 11000) {
        error.message = `A user with the given credentials exists`;
      }
      logger.error(
        `[AccountService: signUp]: Unabled to create a new user: ${error}`
      );
      throw error;
    }
  }

  async signOut(refreshToken: string): Promise<any> {
    try {
      const user = await this.userRepository.findOneByRefreshToken(
        refreshToken
      );
      if (!user) {
        throw new Error('User with given refresh token does not exist');
      }

      // remove user refresh token
      await this.userRepository.findOneByIdAndUpdate(user._id, {
        refreshToken: ''
      });
    } catch (error: any) {
      logger.error(
        `[AccountService: signOut]: Unable to sign user out: ${error}`
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

      // return { user, accessToken, refreshToken };
      return { accessToken, refreshToken };
    } catch (error: any) {
      logger.error(
        `[AccountService: refreshAccessToken]: Unable to create new user access token: ${error}`
      );
      throw error;
    }
  }
}
