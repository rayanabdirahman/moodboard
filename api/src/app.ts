import express from "express";
import cors from "cors";
import logger from "./utilities/logger";

export default (): Promise<express.Application> =>
  new Promise<express.Application>((resolve, reject) => {
    try {
      const app = express();

      // set middleware
      app.use(cors());
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));

      // test api route
      app.get(
        "/api/v1",
        async (
          req: express.Request,
          res: express.Response
        ): Promise<express.Response> => {
          return res.json({ "Moodboard API": "Version 1" });
        }
      );

      resolve(app);
    } catch (error) {
      logger.error(`Error when bootstrapping app: ${error}`);
      reject(error);
    }
  });
