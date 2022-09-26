import { connect, ConnectOptions } from 'mongoose';

import { APP } from 'config';

class Db {
  private name = APP.root.env;

  private username = APP.db.username;

  private password = APP.db.password;

  private connectionString = APP.db.connectionString;

  private options: ConnectOptions = {};

  private get uri() {
    return this.connectionString
      .replace('<DB_USERNAME>', this.username)
      .replace('<DB_PASSWORD>', this.password)
      .replace('<DB_NAME>', this.name);
  }

  connect = async () => {
    try {
      const connection = await connect(this.uri, this.options);

      const { name, host } = connection.connections[0]!;

      console.info(`connected to ${name} database on ${host}`);
    } catch (err) {
      console.error(err);

      const message =
        err instanceof Error ? err.message : 'Something went wrong.';

      throw new Error(message);
    }
  };
}

export const db = new Db();
