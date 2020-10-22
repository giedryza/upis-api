import { Request } from 'express';
import { v4 as uuid } from 'uuid';
import path from 'path';
import multer, { FileFilterCallback } from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import { BadRequestError } from 'errors/bad-request.error';

class Upload {
  private awsCredentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
    bucket: process.env.AWS_BUCKET,
  };

  private limits = {
    maxFiles: 5,
    maxFileSize: 1 * 1000 * 1000,
    cacheAge: 60 * 60 * 24 * 365,
  };

  private folder = process.env.NODE_ENV;

  private s3 = new aws.S3({
    accessKeyId: this.awsCredentials.accessKeyId,
    secretAccessKey: this.awsCredentials.secretAccessKey,
    region: this.awsCredentials.region,
  });

  private fileFilter = (fileFormats: string[]) => (
    _req: Request,
    file: Request['file'],
    cb: FileFilterCallback
  ) => {
    if (fileFormats.includes(file.mimetype)) {
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

  toS3 = (fileFormats: string[]) =>
    multer({
      limits: {
        fileSize: this.limits.maxFileSize,
        files: this.limits.maxFiles,
      },
      fileFilter: this.fileFilter(fileFormats),
      storage: this.storage,
    });
}

export const upload = new Upload();
