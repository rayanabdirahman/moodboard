import { Response } from 'express';

interface IApiResponse {
  success(
    res: Response,
    data: unknown[] | unknown | string,
    status?: number
  ): Response;
  error(
    res: Response,
    error: Record<string, unknown> | string,
    status?: number
  ): Response;
}

const ApiResponse: IApiResponse = {
  success: (
    res: Response,
    data: unknown[] | unknown | string,
    status = 200
  ): Response => {
    return res.status(status).json({
      status: 'success',
      code: res.statusCode,
      data
    });
  },
  error: (
    res: Response,
    error: Record<string, unknown> | string,
    status = 500
  ): Response => {
    return res.status(status).json({
      status: 'error',
      code: res.statusCode,
      error
    });
  }
};

export default ApiResponse;
