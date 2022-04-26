import express from 'express';
import { injectable } from 'inversify';
import config from '../../config';
import AuthenticationGuard from '../../middlewares/AuthenticationGuard';
import ApiResponse from '../../utilities/apiResponse';
import { RegistrableController } from '../registrable.controller';

@injectable()
export default class UserController implements RegistrableController {
  registerRoutes(app: express.Application): void {
    app.get(`${config.API_URL}/users/`, AuthenticationGuard, (req, res) => {
      return ApiResponse.success(res, {
        user: { firstName: 'firstname', lastName: 'lastname' }
      });
    });
  }
}
