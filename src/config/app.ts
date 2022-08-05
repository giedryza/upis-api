import { Locale } from 'types/common';
import { NodeEnv } from 'types/global/env';

export const APP = {
  name: 'Upis',
  email: {
    // TODO: replace with 'info@upis.lt'
    info: 'giedrius.bla@gmail.com',
  },
  client: {
    host: process.env.HOST_CLIENT,
    route: process.env.CLIENT_ROUTE,
    locations: {
      passwordReset: 'password-reset',
    },
  },
  assets: {
    logo: {
      512: 'https://upis.s3.eu-central-1.amazonaws.com/app/logo_512.png',
    },
  },
  root: {
    env: process.env.NODE_ENV as NodeEnv,
    port: +process.env.PORT,
    host: process.env.HOST_API,
  },
  db: {
    connectionString: process.env.DB_CONNECTION_STRING,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  locales: {
    defaultLanguage: Locale.Lt,
    supportedLanguages: [Locale.Lt, Locale.En],
  },
  sendgrid: {
    username: process.env.SENDGRID_USERNAME,
    password: process.env.SENDGRID_PASSWORD,
  },
  mailtrap: {
    host: process.env.MAILTRAP_HOST,
    port: +process.env.MAILTRAP_PORT,
    username: process.env.MAILTRAP_USERNAME,
    password: process.env.MAILTRAP_PASSWORD,
  },
  token: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresInDays: +process.env.JWT_EXPIRES_IN_DAYS,
    tokenExpiresInHours: +process.env.TOKEN_EXPIRES_IN_HOURS,
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretKey: process.env.AWS_SECRET_KEY,
    bucket: process.env.AWS_BUCKET,
    region: process.env.AWS_REGION,
  },
};
