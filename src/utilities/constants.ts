import config from '../config';

export enum TokenExpiration {
  // ACCESS = '30s',
  // REFRESH = '1y'
  ACCESS = 5 * 60,
  REFRESH = 7 * 24 * 60 * 60
}

export enum Cookies {
  ACCESS_TOKEN = 'JWTAccessToken',
  REFRESH_TOKEN = 'JWTRefreshToken'
}

export const defaultCookiesOptions = {
  httpOnly: true,
  sameSite: (config.IS_APP_ENV_PRODUCTION ? 'strict' : 'lax') as any,
  secure: config.IS_APP_ENV_PRODUCTION
};
