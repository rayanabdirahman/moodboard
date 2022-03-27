const config = {
  APP_PORT: process.env.APP_PORT,
  APP_DB_NAME: process.env.APP_DB_NAME,
  APP_DB_USERNAME: process.env.APP_DB_USERNAME,
  APP_DB_PASSWORD: process.env.APP_DB_PASSWORD,
  API_URL: process.env.API_URL,
  APP_JWT_ACCESS_TOKEN_SECRET: process.env.APP_JWT_ACCESS_TOKEN_SECRET,
  APP_JWT_REFRESH_TOKEN_SECRET: process.env.APP_JWT_REFRESH_TOKEN_SECRET,
  IS_APP_ENV_PRODUCTION: process.env.NODE_ENV === 'production'
};

export default config;
