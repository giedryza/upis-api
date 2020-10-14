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

  useTrustProxy = () => {
    this.app.set('trust proxy', true);
  };

  useCookieSession = () => {
    this.app.use(
      cookieSession({
        signed: false,
        secure: true,
      })
    );
  };
}

export { CommonMiddleware };
