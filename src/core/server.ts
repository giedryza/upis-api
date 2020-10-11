import { app } from 'core/app';
import { db } from 'core/db';
import { environment } from 'core/environment';

class Server {
  private port = process.env.PORT;

  start = async () => {
    await environment.verify();

    await db.connect();

    this.listen();
  };

  private listen = () => {
    app.listen(this.port, () => {
      console.info(`server started on port ${this.port}`);
    });
  };
}

export const server = new Server();
