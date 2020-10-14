import { json, Express } from 'express';
import cors from 'cors';
import cookieSession from 'cookie-session';
import { Jwt } from 'utils/jwt';
import { Middleware as AuthMiddleware } from 'domain/auth/auth.middleware';

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
        secure: process.env.NODE_ENV === 'production',
        keys: [process.env.COOKIE_KEY_1, process.env.COOKIE_KEY_2],
        maxAge: Jwt.expiresIn * 1000,
      })
    );
  };

  useCurrentUser = () => {
    this.app.use(AuthMiddleware.currentUser);
  };
}

export { CommonMiddleware };
