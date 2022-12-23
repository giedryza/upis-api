import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';

import { APP } from 'config';
import { BadRequestError } from 'errors';

import { BaseProvider } from './_base';

export class CloudinaryProvider extends BaseProvider {
  private credentials = {
    cloudName: APP.cloudinary.cloudName,
    apiKey: APP.cloudinary.apiKey,
    apiSecret: APP.cloudinary.apiSecret,
  };

  private get provider() {
    cloudinary.config({
      cloud_name: this.credentials.cloudName,
      api_key: this.credentials.apiKey,
      api_secret: this.credentials.apiSecret,
      secure: true,
    });

    return cloudinary;
  }

  protected get storage() {
    return new CloudinaryStorage({
      cloudinary: this.provider,
      params: async (_req, _file) => {
        const options: UploadApiOptions = {
          public_id: this.id,
          folder: this.folder,
          use_filename: false,
        };

        return options;
      },
    });
  }

  delete = async (keys: string[]) => {
    const deleteOne = (id: string) =>
      new Promise<string>((resolve, reject) => {
        this.provider.uploader.destroy(id, (err, _data) => {
          if (err) {
            reject(new BadRequestError('File delete failed.'));
          }

          resolve(id);
        });
      });

    return Promise.all(keys.map((key) => deleteOne(key)));
  };
}
