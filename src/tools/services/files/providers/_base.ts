import { Request } from 'express';
import multer, { FileFilterCallback, StorageEngine } from 'multer';

import { BadRequestError } from 'errors';
import { APP } from 'config';

export abstract class BaseProvider {
  protected abstract storage: StorageEngine;

  abstract delete: (keys: string[]) => Promise<string[]>;

  protected folder = [APP.domain, APP.root.env].join('/');

  protected limits = {
    maxFiles: 5,
    maxFileSize: 1 * 1000 * 1000,
    cacheAge: 60 * 60 * 24 * 365,
  };

  protected fileFilter =
    (fileFormats: string[]) =>
    (_req: Request, file: Request['file'], cb: FileFilterCallback) => {
      if (file && fileFormats.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestError('Invalid file format.'));
      }
    };

  upload = (fileFormats: string[]) =>
    multer({
      limits: {
        fileSize: this.limits.maxFileSize,
        files: this.limits.maxFiles,
      },
      fileFilter: this.fileFilter(fileFormats),
      storage: this.storage,
    });
}
