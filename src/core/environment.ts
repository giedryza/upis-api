class Environment {
  readonly variables = [
    'NODE_ENV',
    'PORT',
    'HOST_CLIENT',
    'DB_CONNECTION_STRING',
    'DB_USERNAME',
    'DB_PASSWORD',
    'SENDGRID_USERNAME',
    'SENDGRID_PASSWORD',
    'MAILTRAP_HOST',
    'MAILTRAP_PORT',
    'MAILTRAP_USERNAME',
    'MAILTRAP_PASSWORD',
    'JWT_SECRET',
    'JWT_EXPIRES_IN_DAYS',
    'TOKEN_EXPIRES_IN_HOURS',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_KEY',
    'AWS_BUCKET',
    'AWS_REGION',
    'CLIENT_ROUTE',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ] as const;

  verify = (): Promise<void> =>
    new Promise((resolve, reject) => {
      this.variables.forEach((variable) => {
        if (!process.env[variable]) {
          reject(new Error(`Missing Environment Variable: ${variable}`));
        }
      });

      resolve();
    });
}

export const environment = new Environment();
