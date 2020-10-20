import mongoose, { ConnectionOptions } from 'mongoose';

class Db {
  private name = process.env.NODE_ENV;

  private username = process.env.DB_USERNAME;

  private password = process.env.DB_PASSWORD;

  private connectionString = process.env.DB_CONNECTION_STRING;

  private options: ConnectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  };

  get uri() {
    return this.connectionString
      .replace('<DB_USERNAME>', this.username)
      .replace('<DB_PASSWORD>', this.password)
      .replace('<DB_NAME>', this.name);
  }

  connect = async () => {
    try {
      const connection = await mongoose.connect(this.uri, this.options);

      const { name, host } = connection.connections[0];

      console.info(`connected to ${name} database on ${host}`);
    } catch (err) {
      console.error(err);

      throw new Error(err.message);
    }
  };
}

export const db = new Db();
