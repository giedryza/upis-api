import jwt from 'jsonwebtoken';

export class Jwt {
  private static secret = process.env.JWT_SECRET;

  private static expiresIn = +process.env.JWT_EXPIRES_IN_DAYS * 24 * 60 * 60;

  static token = (payload: object) =>
    jwt.sign(payload, Jwt.secret, {
      expiresIn: Jwt.expiresIn,
    });
}
