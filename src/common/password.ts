import { scrypt, randomBytes } from 'crypto';
import { BadRequestError } from 'errors/bad-request.error';

export class Password {
  static hash = async (password: string): Promise<string> =>
    new Promise((resolve, reject) => {
      const salt = randomBytes(16).toString('hex');

      scrypt(password, salt, 64, (err, buffer) => {
        if (err) {
          reject(err);
        }

        resolve(`${buffer.toString('hex')}:${salt}`);
      });
    });

  static compare = async (hash: string, password: string): Promise<boolean> =>
    new Promise((resolve, reject) => {
      const [key, salt] = hash.split(':');

      if (!key || !salt) {
        return reject(
          new BadRequestError('Incorrect email or password. Try again.')
        );
      }

      scrypt(password, salt, 64, (err, buffer) => {
        if (err) {
          return reject(err);
        }

        resolve(key === buffer.toString('hex'));
      });
    });
}
