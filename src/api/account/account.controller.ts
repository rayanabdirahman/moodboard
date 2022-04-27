import { Application, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import config from '../../config';
import {
  IGoogleSignInModel,
  IGoogleSignUpModel,
  ISignUpModel,
  ISignInModel
} from '../../domain/interfaces/account';
import AuthenticationGuard from '../../middlewares/AuthenticationGuard';
import { IAccountService } from '../../services/account.service';
import TYPES from '../../types';
import ApiResponse, {
  ApiErrorStatusCodeEnum,
  ApiSuccessStatusCodeEnum
} from '../../utilities/apiResponse';
import { Cookies } from '../../utilities/constants';
import CookiesUtil from '../../utilities/cookiesUtil';
import getAvatar from '../../utilities/getAvatar';
import logger from '../../utilities/logger';
import { RegistrableController } from '../registrable.controller';
import AccountValidator from './account.validator';

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
    app.post(`${config.API_URL}/accounts/auth/signup`, this.signUp);
    app.post(`${config.API_URL}/accounts/auth/signin`, this.signIn);
    app.post(
      `${config.API_URL}/accounts/auth/signout`,
      AuthenticationGuard,
      this.signOut
    );
    // app.get(
    //   `${config.API_URL}/accounts/auth/accessToken/refresh`,
    //   this.refreshAccessToken
    // );
    app.post(
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

      CookiesUtil.setTokens(res, accessToken, refreshToken);

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

      CookiesUtil.setTokens(res, accessToken, refreshToken);

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
      const model: ISignUpModel = {
        ...req.body,
        // default user avatar
        avatar: getAvatar.default(req.body.first_name, req.body.last_name),
        role: req.body.role && req.body.role
      };

      // validate request body
      const validity = AccountValidator.signUp(model);
      if (validity.error) {
        const { message } = validity.error;
        return ApiResponse.error(res, message);
      }

      const { user, accessToken, refreshToken } =
        await this.accountService.signUp(model);

      CookiesUtil.setTokens(res, accessToken, refreshToken);

      return ApiResponse.success(res, { user, accessToken });
    } catch (error: any) {
      logger.error(
        `[AccountController: signup] - Unable to sign up user: ${error?.message}`
      );
      return ApiResponse.error(res, error?.message);
    }
  };

  signIn = async (req: Request, res: Response): Promise<Response> => {
    try {
      const model: ISignInModel = {
        ...req.body
      };

      // validate request body
      const validity = AccountValidator.signIn(model);
      if (validity.error) {
        const { message } = validity.error;
        return ApiResponse.error(res, message);
      }

      return ApiResponse.success(res, model);
    } catch (error: any) {
      logger.error(
        `[AccountController: signIn] - Unable to sign in user: ${error?.message}`
      );
      return ApiResponse.error(res, error?.message);
    }
  };

  signOut = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const cookieRefreshToken = req.cookies[Cookies.REFRESH_TOKEN];
      if (!cookieRefreshToken) {
        const message = 'No user to sign out';
        return ApiResponse.success(
          res,
          message,
          ApiSuccessStatusCodeEnum.NO_CONTENT
        );
      }

      // const dbRefreshToken = await this.accountService.isRefreshTokenInDB(
      //   cookieRefreshToken
      // );
      // if (!dbRefreshToken) {
      //   res.clearCookie('jwt', {
      //     httpOnly: true,
      //     sameSite: 'none'
      //     // secure: true uncomment when https is implemented
      //   });
      // }

      await this.accountService.signOut(cookieRefreshToken);

      CookiesUtil.clearTokens(res);

      res.end();

      // return ApiResponse.success(
      //   res,
      //   'Signed out successfully',
      //   ApiSuccessStatusCodeEnum.NO_CONTENT
      // );
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
  ): Promise<Response | void> => {
    try {
      const cookieRefreshToken = req.cookies[Cookies.REFRESH_TOKEN];
      if (!cookieRefreshToken) {
        const message = 'Authentication denied. Refresh token invalid';
        return ApiResponse.error(
          res,
          message,
          ApiErrorStatusCodeEnum.UNAUTHORIZED
        );
      }

      const { accessToken, refreshToken } =
        await this.accountService.refreshAccessToken(cookieRefreshToken);

      CookiesUtil.setTokens(res, accessToken, refreshToken);

      return ApiResponse.success(res, 'Refresh triggered');
    } catch (error: any) {
      logger.error(
        `[AccountController: refreshAccessToken] - Unable to create new user access token: ${error?.message}`
      );
      CookiesUtil.clearTokens(res);
      return ApiResponse.error(
        res,
        error?.message,
        ApiErrorStatusCodeEnum.FORBIDDEN
      );
    }
  };
}
