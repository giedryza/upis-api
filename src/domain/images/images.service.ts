import { TFunction } from 'i18next';

import { BadRequestError } from 'errors';
import { filesService } from 'tools/services';

import { Image } from './images.model';
import { ImageRecord } from './images.types';

interface CreateMany {
  data: {
    files: {
      url: string;
      key: string;
      contentType: string;
      description?: string;
    }[];
  };
  t: TFunction;
}

interface Update {
  data: {
    id: string;
    description?: string;
  };
  t: TFunction;
}

interface Destroy {
  data: {
    id: string;
  };
  t: TFunction;
}

export class Service {
  static createMany = async ({
    data: { files },
    t,
  }: CreateMany): Promise<{ data: ImageRecord[] }> => {
    const images = await Image.insertMany(
      files.map((file) => ({
        url: file.url,
        key: file.key,
        contentType: file.contentType,
        description: file.description ?? '',
      }))
    );

    if (!images) {
      throw new BadRequestError(t('images.errors.id.createMany'));
    }

    return {
      data: images,
    };
  };

  static update = async ({
    data,
    t,
  }: Update): Promise<{ data: ImageRecord }> => {
    const { id, ...update } = data;

    const image = await Image.findByIdAndUpdate(id, update).lean();

    if (!image) {
      throw new BadRequestError(t('images.errors.id.update'));
    }

    return {
      data: image,
    };
  };

  static destroy = async ({ data: { id }, t }: Destroy): Promise<void> => {
    const image = await Image.findByIdAndDelete(id).lean();

    if (!image) {
      throw new BadRequestError(t('images.errors.id.destroy'));
    }

    await filesService.delete([image.key]);
  };
}
