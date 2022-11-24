import { Request } from 'express';
import { v4 as uuid } from 'uuid';
import path from 'path';
import multer, { FileFilterCallback, StorageEngine } from 'multer';
import multerS3 from 'multer-s3';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';
import aws from 'aws-sdk';

import { APP } from 'config';
import { BadRequestError } from 'errors';

type StorageProvider = 's3' | 'cloudinary';

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

  private get cloudinary() {
    cloudinary.config({
      cloud_name: APP.cloudinary.cloudName,
      api_key: APP.cloudinary.apiKey,
      api_secret: APP.cloudinary.apiSecret,
      secure: true,
    });

    return cloudinary;
  }

  constructor(private storageProvider: StorageProvider) {}

  private fileFilter =
    (fileFormats: string[]) =>
    (_req: Request, file: Request['file'], cb: FileFilterCallback) => {
      if (file && fileFormats.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestError('Invalid file format.'));
      }
    };

  private s3Storage = multerS3({
    s3: this.s3,
    acl: 'public-read',
    bucket: this.awsCredentials.bucket,
    contentType: (_req, file, cb) => {
      cb(null, file.mimetype);
    },
    cacheControl: `max-age=${this.limits.cacheAge}`,
    key: (_req, file, cb) => {
      cb(null, `${this.folder}/${uuid()}${path.extname(file.originalname)}`);
    },
  });

  private get cloudinaryStorage() {
    return new CloudinaryStorage({
      cloudinary: this.cloudinary,
      params: async (_req, _file) => {
        const options: UploadApiOptions = {
          public_id: uuid(),
          folder: `${APP.domain}/${APP.root.env}`,
        };

        return options;
      },
    });
  }

  private storage: Record<StorageProvider, StorageEngine> = {
    s3: this.s3Storage,
    cloudinary: this.cloudinaryStorage,
  };

  upload = (fileFormats: string[]) =>
    multer({
      limits: {
        fileSize: this.limits.maxFileSize,
        files: this.limits.maxFiles,
      },
      fileFilter: this.fileFilter(fileFormats),
      storage: this.storage[this.storageProvider],
    });

  private deletes3 = async (keys: string[]) =>
    new Promise<string[]>((resolve, reject) => {
      this.s3.deleteObjects(
        {
          Bucket: this.awsCredentials.bucket,
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

  private deleteCloudinary = async (keys: string[]) => {
    const deleteOne = (id: string) =>
      new Promise<string>((resolve, reject) => {
        this.cloudinary.uploader.destroy(id, (err, _data) => {
          if (err) {
            reject(new BadRequestError('File delete failed.'));
          }

          resolve(id);
        });
      });

    return Promise.all(keys.map((key) => deleteOne(key)));
  };

  private deleteByProvider: Record<
    StorageProvider,
    (keys: string[]) => Promise<string[]>
  > = {
    s3: this.deletes3,
    cloudinary: this.deleteCloudinary,
  };

  delete = this.deleteByProvider[this.storageProvider];
}

export const filesService = (storageProvider: StorageProvider) =>
  new FilesService(storageProvider);
