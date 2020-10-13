import { json, Express } from 'express';
import cors from 'cors';
import cookieSession from 'cookie-session';

class CommonMiddleware {
  constructor(private app: Express) {}

  useJson = () => {
    this.app.use(json());
  };

  useCors = () => {
    this.app.use(cors());
  };

  useCookieSession = () => {
    this.app.use(
      cookieSession({
        signed: true,
        secure: true,
        keys: [process.env.COOKIE_KEY_1, process.env.COOKIE_KEY_2],
      })
    );
  };
}

export { CommonMiddleware };
