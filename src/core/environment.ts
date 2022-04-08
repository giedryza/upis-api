import { Env } from 'types/global/env';

class Environment {
  private requiredVariables: (keyof Env)[] = [
    'NODE_ENV',
    'PORT',
    'HOST_CLIENT',
    'HOST_API',
    'DB_CONNECTION_STRING',
    'DB_USERNAME',
    'DB_PASSWORD',
    'JWT_SECRET',
    'JWT_EXPIRES_IN_DAYS',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_KEY',
    'AWS_BUCKET',
    'AWS_REGION',
  ];

  verify = (): Promise<void> =>
    new Promise((resolve, reject) => {
      this.requiredVariables.forEach((variable) => {
        if (!process.env[variable]) {
          reject(new Error(`Missing Environment Variable: ${variable}`));
        }
      });

      resolve();
    });
}

export const environment = new Environment();
