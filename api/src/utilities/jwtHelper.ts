import jwt from 'jsonwebtoken';
import config from '../config';
import { IUserDocument } from '../database/models/user.model';
import { IJWTPayload } from '../domain/interfaces/account';
import { TokenExpiration } from './constants';
import logger from './logger';

interface IBuildTokenReturnType {
  accessToken: string;
  refreshToken: string;
}

interface IJWTHelper {
  signAccessToken(user: IUserDocument): Promise<string>;
  signRefreshToken(user: IUserDocument): Promise<string>;
  decodeAccessToken(token: string): Promise<IJWTPayload>;
  decodeRefreshToken(token: string): Promise<IJWTPayload>;
  buildTokens(user: IUserDocument): Promise<IBuildTokenReturnType>;
}

const _setPayload = (user: IUserDocument): IJWTPayload => {
  return {
    user: {
      _id: user._id as unknown as string,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role
    }
  };
};

const JWTHelper: IJWTHelper = {
  async signAccessToken(user: IUserDocument): Promise<string> {
    const payload = _setPayload(user);

    return jwt.sign(payload, `${config.APP_JWT_ACCESS_TOKEN_SECRET}`, {
      expiresIn: TokenExpiration.ACCESS
    });
  },
  async signRefreshToken(user: IUserDocument): Promise<string> {
    const payload = _setPayload(user);

    return jwt.sign(payload, `${config.APP_JWT_REFRESH_TOKEN_SECRET}`, {
      expiresIn: TokenExpiration.REFRESH
    });
  },
  async buildTokens(user: IUserDocument): Promise<IBuildTokenReturnType> {
    const accessToken = await this.signAccessToken(user);
    const refreshToken = await this.signRefreshToken(user);

    return { accessToken, refreshToken };
  },
  async decodeAccessToken(token: string): Promise<IJWTPayload> {
    try {
      return jwt.verify(
        token,
        `${config.APP_JWT_ACCESS_TOKEN_SECRET}`
      ) as IJWTPayload;
    } catch (error: any) {
      const { message } = error;
      logger.error(
        `[JwtHelper] - Unable to decode user access token: ${message}`
      );
      throw message;
    }
  },
  async decodeRefreshToken(token: string): Promise<IJWTPayload> {
    try {
      return jwt.verify(
        token,
        `${config.APP_JWT_REFRESH_TOKEN_SECRET}`
      ) as IJWTPayload;
    } catch (error: any) {
      const { message } = error;
      logger.error(
        `[JwtHelper] - Unable to decode user refresh token: ${message}`
      );
      throw message;
    }
  }
};

export default JWTHelper;
