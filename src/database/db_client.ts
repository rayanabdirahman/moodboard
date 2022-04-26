import config from '../config';
import mongoose from 'mongoose';
import logger from '../utilities/logger';

const MONGO_URL = `mongodb+srv://${config.APP_DB_USERNAME}:${config.APP_DB_PASSWORD}@cluster0.q9g0p.mongodb.net/${config.APP_DB_NAME}?retryWrites=true&w=majority`;

const connectToDbClient = async (uri: string = MONGO_URL): Promise<void> => {
  try {
    await mongoose.connect(uri);

    logger.info(`Successfully connected to database ✅`);
  } catch (error) {
    logger.error(`Failed to connect to database 🛑 : ${error}`);
  }
};

export default connectToDbClient;
