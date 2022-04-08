export type NodeEnv = 'production' | 'development';

export interface Env {
  NODE_ENV: NodeEnv;
  PORT: string;
  HOST_CLIENT: string;
  HOST_API: string;
  DB_CONNECTION_STRING: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN_DAYS: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_KEY: string;
  AWS_BUCKET: string;
  AWS_REGION: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
