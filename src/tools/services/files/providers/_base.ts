import { Request } from 'express';
import multer, { FileFilterCallback, StorageEngine } from 'multer';
import { v4 as uuid } from 'uuid';

import { BadRequestError } from 'errors';
import { APP } from 'config';

const MIME_TYPE_BY_FILE = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  avif: 'image/avif',
  svg: 'image/svg+xml',
  gif: 'image/gif',
  bmp: 'image/bmp',
  avi: 'video/x-msvideo',
  mp4: 'video/mp4',
  mpeg: 'video/mpeg',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  csv: 'text/csv',
  txt: 'text/plain',
  doc: 'application/msword',
  rtf: 'application/rtf',
  json: 'application/json',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pdf: 'application/pdf',
  rar: 'application/vnd.rar',
  zip: 'application/zip',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

export abstract class BaseProvider {
  protected abstract storage: StorageEngine;

  abstract delete: (keys: string[]) => Promise<string[]>;

  protected folder = [APP.domain, APP.root.env].join('/');

  protected limits = {
    maxFiles: 5,
    maxFileSize: 1 * 1000 * 1000,
    cacheAge: 60 * 60 * 24 * 365,
  };

  protected get id() {
    return uuid();
  }

  protected fileFilter =
    (fileFormats: string[]) =>
    (_req: Request, file: Request['file'], cb: FileFilterCallback) => {
      if (file && fileFormats.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestError('Invalid file format.'));
      }
    };

  upload = (types: (keyof typeof MIME_TYPE_BY_FILE)[]) =>
    multer({
      limits: {
        fileSize: this.limits.maxFileSize,
        files: this.limits.maxFiles,
      },
      fileFilter: this.fileFilter(types.map((type) => MIME_TYPE_BY_FILE[type])),
      storage: this.storage,
    });
}
