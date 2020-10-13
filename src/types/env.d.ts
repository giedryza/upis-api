export type NodeEnv = 'production' | 'development';

export interface CustomProcessEnv {
  NODE_ENV: NodeEnv;
  PORT: string;
  DB_CONNECTION_STRING: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN_DAYS: string;
  COOKIE_KEY_1: string;
  COOKIE_KEY_2: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends CustomProcessEnv {}
  }
}
