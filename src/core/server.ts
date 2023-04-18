import gracefulShutdown from 'http-graceful-shutdown';

import { APP } from 'config';

import { app } from './app';
import { db } from './db';
import { environment } from './environment';
import { cron } from './cron';

class Server {
  private port = APP.root.port;

  private listen = () =>
    app.listen(this.port, () => {
      console.info(`server started on port ${this.port}`);
    });

  start = async () => {
    try {
      await environment.verify();

      await db.connect();

      cron.start();

      const server = this.listen();

      gracefulShutdown(server);
    } catch (error) {
      console.error(error);
    }
  };
}

export const server = new Server();
