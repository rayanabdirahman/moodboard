import { Request, Response, NextFunction } from 'express';
import { IJWTPayload } from '../domain/interfaces/account';
import ApiResponse, { ApiErrorStatusCodeEnum } from '../utilities/apiResponse';
import JWTHelper from '../utilities/jwtHelper';
import logger from '../utilities/logger';

const AuthenticationGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // check if Authorization header has been defined
    const { authorization } = req.headers;
    if (!authorization) {
      throw new Error('Authentication denied. Please sign in');
    }

    // extract jwt from Authorization header by removing Bearer text (format: Bearer token)
    const token = authorization.replace('Bearer ', '');

    // verify token
    const decoded: IJWTPayload = await JWTHelper.decodeAccessToken(token);
    if (!decoded) {
      throw new Error(decoded);
    }

    req.user = decoded.user;

    next();
  } catch (error: any) {
    const message = error.message ? error.message : error;
    const statusCode =
      message !== 'Authentication denied. Please sign in'
        ? ApiErrorStatusCodeEnum.FORBIDDEN
        : ApiErrorStatusCodeEnum.UNAUTHORIZED;
    logger.error(
      `[AuthenticationGuard] - Unable to authorise user: ${message}`
    );
    return ApiResponse.error(res, message, statusCode);
  }
};

export default AuthenticationGuard;
