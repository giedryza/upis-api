import { scrypt, randomBytes } from 'crypto';

import { BadRequestError } from 'errors';

export class Password {
  static hash = async (password: string): Promise<string> =>
    new Promise((resolve, reject) => {
      const salt = Password.randomString();

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
        reject(new BadRequestError('Incorrect email or password. Try again.'));
        return;
      }

      scrypt(password, salt, 64, (err, buffer) => {
        if (err) {
          return reject(err);
        }

        resolve(key === buffer.toString('hex'));
      });
    });

  static randomString = () => randomBytes(32).toString('hex');
}
