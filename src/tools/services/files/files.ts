import { Request } from 'express';
import { v4 as uuid } from 'uuid';
import path from 'path';
import multer, { FileFilterCallback } from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';

import { APP } from 'config';
import { BadRequestError } from 'errors';

class FilesService {
  private awsCredentials = {
    accessKeyId: APP.aws.accessKeyId,
    secretAccessKey: APP.aws.secretKey,
    region: APP.aws.region,
    bucket: APP.aws.bucket,
  };

  private limits = {
    maxFiles: 5,
    maxFileSize: 1 * 1000 * 1000,
    cacheAge: 60 * 60 * 24 * 365,
  };

  private folder = APP.root.env;

  private s3 = new aws.S3({
    accessKeyId: this.awsCredentials.accessKeyId,
    secretAccessKey: this.awsCredentials.secretAccessKey,
    region: this.awsCredentials.region,
  });

  private fileFilter =
    (fileFormats: string[]) =>
    (_req: Request, file: Request['file'], cb: FileFilterCallback) => {
      if (file && fileFormats.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestError('Invalid file format.'));
      }
    };

  private storage = multerS3({
    s3: this.s3,
    acl: 'public-read',
    bucket: this.awsCredentials.bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    cacheControl: `max-age=${this.limits.cacheAge}`,
    key: (_req, file, cb) => {
      cb(null, `${this.folder}/${uuid()}${path.extname(file.originalname)}`);
    },
  });

  upload = (fileFormats: string[]) =>
    multer({
      limits: {
        fileSize: this.limits.maxFileSize,
        files: this.limits.maxFiles,
      },
      fileFilter: this.fileFilter(fileFormats),
      storage: this.storage,
    });

  delete = async (key: string) => {
    try {
      await new Promise((resolve, reject) => {
        const params = { Bucket: this.awsCredentials.bucket, Key: key };

        this.s3.deleteObject(params, (err, data) => {
          if (err) {
            reject(new BadRequestError('File delete failed.'));
          }

          resolve(data);
        });
      });
    } catch (err: unknown) {
      console.error(err);
    }
  };
}

export const filesService = new FilesService();
