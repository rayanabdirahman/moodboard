import { Application, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import config from '../../config';
import {
  IGoogleSignInModel,
  IGoogleSignUpModel,
  SignInModel,
  SignUpModel
} from '../../domain/interfaces/account';
import { IAccountService } from '../../services/account.service';
import TYPES from '../../types';
import ApiResponse, {
  ApiErrorStatusCodeEnum,
  ApiSuccessStatusCodeEnum
} from '../../utilities/apiResponse';
import getAvatar from '../../utilities/getAvatar';
import logger from '../../utilities/logger';
import { RegistrableController } from '../registrable.controller';

@injectable()
export default class AccountController implements RegistrableController {
  private accountService: IAccountService;

  constructor(@inject(TYPES.AccountService) accountService: IAccountService) {
    this.accountService = accountService;
  }

  registerRoutes(app: Application): void {
    app.post(
      `${config.API_URL}/accounts/auth/google/signup`,
      this.googleSignUp
    );
    app.post(
      `${config.API_URL}/accounts/auth/google/signin`,
      this.googleSignIn
    );
    app.post(`${config.API_URL}/accounts/signup`, this.signUp);
    app.post(`${config.API_URL}/accounts/signin`, this.signIn);
    app.post(`${config.API_URL}/accounts/signout`, this.signOut);
    app.get(
      `${config.API_URL}/accounts/auth/accessToken/refresh`,
      this.refreshAccessToken
    );
  }

  googleSignUp = async (req: Request, res: Response): Promise<Response> => {
    try {
      const model: IGoogleSignUpModel = {
        ...req.body,
        role: req.body.role && req.body.role
      };

      const { user, accessToken, refreshToken } =
        await this.accountService.googleSignUp(model);

      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        // secure: true, uncomment when https is implemented
        // option to set cookies longer
        maxAge: 24 * 60 * 60 * 1000
      });

      return ApiResponse.success(res, { user, accessToken });
    } catch (error: any) {
      logger.error(
        `[AccountController: googleSignUp] - Unable to sign up user with google auth: ${error?.message}`
      );
      return ApiResponse.error(res, error?.message);
    }
  };

  googleSignIn = async (req: Request, res: Response): Promise<Response> => {
    try {
      const model: IGoogleSignInModel = {
        ...req.body
      };

      const { user, accessToken, refreshToken } =
        await this.accountService.googleSignIn(model);

      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        // secure: true, uncomment when https is implemented
        // option to set cookies longer
        maxAge: 24 * 60 * 60 * 1000
      });

      return ApiResponse.success(res, { user, accessToken });
    } catch (error: any) {
      logger.error(
        `[AccountController: googleSignIn] - Unable to sign in user with google auth: ${error?.message}`
      );
      return ApiResponse.error(
        res,
        error?.message,
        ApiErrorStatusCodeEnum.NOT_FOUND
      );
    }
  };

  signUp = async (req: Request, res: Response): Promise<Response> => {
    try {
      const model: SignUpModel = {
        ...req.body,
        // default user avatar
        avatar: getAvatar.default(req.body.name),
        role: req.body.role && req.body.role
      };

      return ApiResponse.success(res, model);
    } catch (error: any) {
      logger.error(
        `[AccountController: signup] - Unable to sign up user: ${error?.message}`
      );
      return ApiResponse.error(res, error?.message);
    }
  };

  signIn = async (req: Request, res: Response): Promise<Response> => {
    try {
      const model: SignInModel = {
        ...req.body
      };

      return ApiResponse.success(res, model);
    } catch (error: any) {
      logger.error(
        `[AccountController: signIn] - Unable to sign in user: ${error?.message}`
      );
      return ApiResponse.error(res, error?.message);
    }
  };

  signOut = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { jwt: refreshToken } = req.cookies;
      if (!refreshToken) {
        const message = 'No user to sign out';
        return ApiResponse.success(
          res,
          message,
          ApiSuccessStatusCodeEnum.NO_CONTENT
        );
      }

      const dbRefreshToken = await this.accountService.isRefreshTokenInDB(
        refreshToken
      );
      if (!dbRefreshToken) {
        res.clearCookie('jwt', {
          httpOnly: true,
          sameSite: 'none'
          // secure: true uncomment when https is implemented
        });
      }

      await this.accountService.signOut(refreshToken);
      res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'none'
        // secure: true uncomment when https is implemented
      });

      return ApiResponse.success(
        res,
        'Signed out successfully',
        ApiSuccessStatusCodeEnum.NO_CONTENT
      );
    } catch (error: any) {
      logger.error(
        `[AccountController: signIn] - Unable to sign in user: ${error?.message}`
      );
      return ApiResponse.error(res, error?.message);
    }
  };

  refreshAccessToken = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { jwt: refreshToken } = req.cookies;
      if (!refreshToken) {
        const message = 'Authentication denied. Refresh token invalid';
        return ApiResponse.error(
          res,
          message,
          ApiErrorStatusCodeEnum.UNAUTHORIZED
        );
      }

      const { user, accessToken } =
        await this.accountService.refreshAccessToken(refreshToken);

      return ApiResponse.success(res, { user, accessToken });
    } catch (error: any) {
      logger.error(
        `[AccountController: refreshAccessToken] - Unable to create new user access token: ${error?.message}`
      );
      return ApiResponse.error(
        res,
        error?.message,
        ApiErrorStatusCodeEnum.FORBIDDEN
      );
    }
  };
}
