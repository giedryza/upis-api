import gracefulShutdown from 'http-graceful-shutdown';

import { app } from 'core/app';
import { db } from 'core/db';
import { environment } from 'core/environment';

class Server {
  private port = process.env.PORT;

  private listen = () =>
    app.listen(this.port, () => {
      console.info(`server started on port ${this.port}`);
    });

  start = async () => {
    try {
      await environment.verify();

      await db.connect();

      const server = this.listen();

      gracefulShutdown(server);
    } catch (error) {
      console.error(error);
    }
  };
}

export const server = new Server();
