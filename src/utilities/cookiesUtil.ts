import { Response } from 'express';
import { Cookies, defaultCookiesOptions, TokenExpiration } from './constants';

const CookiesOptions = {
  ACCESS_TOKEN: {
    ...defaultCookiesOptions,
    maxAge: TokenExpiration.ACCESS * 1000
  },
  REFRESH_TOKEN: {
    ...defaultCookiesOptions,
    maxAge: TokenExpiration.REFRESH * 1000
  }
};

interface IJWTHelper {
  setTokens(res: Response, access: string, refresh?: string): void;
  clearTokens(res: Response): void;
}

const CookiesUtil: IJWTHelper = {
  setTokens(res: Response, access: string, refresh?: string): void {
    res.cookie(Cookies.ACCESS_TOKEN, access, CookiesOptions.ACCESS_TOKEN);
    if (refresh)
      res.cookie(Cookies.REFRESH_TOKEN, refresh, CookiesOptions.REFRESH_TOKEN);
  },
  clearTokens(res: Response): void {
    res.cookie(Cookies.ACCESS_TOKEN, '', {
      ...defaultCookiesOptions,
      maxAge: 0
    });
    res.cookie(Cookies.REFRESH_TOKEN, '', {
      ...defaultCookiesOptions,
      maxAge: 0
    });
  }
};

export default CookiesUtil;
