import { app } from 'core/app.core';

class Server {
  private port = process.env.PORT;

  private requiredVariables = ['PORT'];

  start = async () => {
    this.verifyEnvVariables();
    this.listen();
  };

  private verifyEnvVariables = () => {
    this.requiredVariables.forEach((variable) => {
      if (!process.env[variable]) {
        throw new Error(`Missing Environment Variable: ${variable}`);
      }
    });
  };

  private listen = () => {
    app.listen(this.port, () => {
      // eslint-disable-next-line no-console
      console.log(`server started on port ${this.port}`);
    });
  };
}

export const server = new Server();
