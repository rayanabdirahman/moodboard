// config environment variables
import dotenv from 'dotenv';
dotenv.config();
import bootstrapApp from './app';
import config from './config';
import connectToDbClient from './database/db_client';
import logger from './utilities/logger';

const runApp = async () => {
  try {
    logger.debug(`[START]: Bootstrapping app`);
    const PORT = process.env.PORT || config.APP_PORT;

    const app = await bootstrapApp();

    // connect to database
    await connectToDbClient();

    app.listen(PORT, () => logger.info(`App running on PORT: ${PORT}`));

    return app;
  } catch (error) {
    logger.error(`Failed to run app: ${error}`);
  }
};

(async () => await runApp())();
