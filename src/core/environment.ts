import { CustomProcessEnv } from 'types/env';

class Environment {
  private requiredVariables: (keyof CustomProcessEnv)[] = [
    'NODE_ENV',
    'PORT',
    'DB_CONNECTION_STRING',
    'DB_USERNAME',
    'DB_PASSWORD',
  ];

  verify = () =>
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
