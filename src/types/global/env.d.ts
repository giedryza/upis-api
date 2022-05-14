export type NodeEnv = 'production' | 'development';

export interface Env {
  NODE_ENV: string;
  PORT: string;
  HOST_CLIENT: string;
  HOST_API: string;
  DB_CONNECTION_STRING: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  SENDGRID_USERNAME: string;
  SENDGRID_PASSWORD: string;
  MAILTRAP_HOST: string;
  MAILTRAP_PORT: string;
  MAILTRAP_USERNAME: string;
  MAILTRAP_PASSWORD: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN_DAYS: string;
  TOKEN_EXPIRES_IN_HOURS: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_KEY: string;
  AWS_BUCKET: string;
  AWS_REGION: string;
  CLIENT_ROUTE: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
