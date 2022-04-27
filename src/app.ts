import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import logger from './utilities/logger';
import { RegistrableController } from './api/registrable.controller';
import container from './inversify.config';
import TYPES from './types';
import corsOptions from './utilities/corsOptions';

export default (): Promise<express.Application> =>
  new Promise<express.Application>((resolve, reject) => {
    try {
      const app = express();

      // set middleware
      app.use(helmet());
      app.use(cors(corsOptions));
      app.use(express.urlencoded({ extended: true }));
      app.use(express.json());
      app.use(cookieParser());
      // use HTTP logger for api requests
      app.use(morgan('dev'));

      // register api routes
      const controllers: RegistrableController[] =
        container.getAll<RegistrableController>(TYPES.Controller);
      controllers.forEach((controller) => controller.registerRoutes(app));

      // test api route
      app.get(
        '/api/v1',
        async (
          req: express.Request,
          res: express.Response
        ): Promise<express.Response> => {
          return res.json({ 'Moodboard API': 'Version 1' });
        }
      );

      resolve(app);
    } catch (error) {
      logger.error(`Error when bootstrapping app: ${error}`);
      reject(error);
    }
  });
