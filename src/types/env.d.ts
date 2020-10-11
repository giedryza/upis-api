export type NodeEnv = 'production' | 'development';

export interface CustomProcessEnv {
  NODE_ENV: NodeEnv;
  PORT: string;
  DB_CONNECTION_STRING: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends CustomProcessEnv {}
  }
}
