import express from 'express';
import { injectable } from 'inversify';
import config from '../../config';
import AuthenticationGuard from '../../middlewares/AuthenticationGuard';
import { RegistrableController } from '../registrable.controller';

@injectable()
export default class UserController implements RegistrableController {
  registerRoutes(app: express.Application): void {
    app.get(`${config.API_URL}/users/`, AuthenticationGuard, (req, res) => {
      res.json({ hello: 'world' });
    });
  }
}
