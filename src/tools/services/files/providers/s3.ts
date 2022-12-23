import path from 'path';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import { v4 as uuid } from 'uuid';

import { APP } from 'config';
import { BadRequestError } from 'errors';

import { BaseProvider } from './_base';

export class S3Provider extends BaseProvider {
  private credentials = {
    accessKeyId: APP.aws.accessKeyId,
    secretAccessKey: APP.aws.secretKey,
    region: APP.aws.region,
    bucket: APP.aws.bucket,
  };

  private provider = new aws.S3({
    accessKeyId: this.credentials.accessKeyId,
    secretAccessKey: this.credentials.secretAccessKey,
    region: this.credentials.region,
  });

  protected storage = multerS3({
    s3: this.provider,
    acl: 'public-read',
    bucket: this.credentials.bucket,
    contentType: (_req, file, cb) => {
      cb(null, file.mimetype);
    },
    cacheControl: `max-age=${this.limits.cacheAge}`,
    key: (_req, file, cb) => {
      cb(null, `${this.folder}/${uuid()}${path.extname(file.originalname)}`);
    },
  });

  delete = async (keys: string[]) =>
    new Promise<string[]>((resolve, reject) => {
      this.provider.deleteObjects(
        {
          Bucket: this.credentials.bucket,
          Delete: { Objects: keys.map((key) => ({ Key: key })) },
        },
        (err, _data) => {
          if (err) {
            reject(new BadRequestError('File delete failed.'));
          }

          resolve(keys);
        }
      );
    });
}
