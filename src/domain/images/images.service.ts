import { LeanDocument } from 'mongoose';
import { TFunction } from 'i18next';

import { BadRequestError } from 'errors';
import { EntityId } from 'types/common';

import { Image } from './images.model';
import { ImageDocument, ImageRecord } from './images.types';

interface GetOne {
  data: {
    id: string;
  };
}

interface CreateMany {
  data: {
    files: {
      url: string;
      key: string;
      contentType: string;
      description?: string;
    }[];
    user: EntityId;
  };
  t: TFunction;
}

interface Create {
  data: {
    file: {
      url: string;
      key: string;
      contentType: string;
      description?: string;
    };
    user: EntityId;
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
  static getOne = async ({
    data: { id },
  }: GetOne): Promise<{ data: LeanDocument<ImageDocument> | null }> => {
    const image = await Image.findById(id).lean();

    if (!image) {
      return { data: null };
    }

    return {
      data: image,
    };
  };

  static create = async ({
    data: { file, user },
    t,
  }: Create): Promise<{ data: ImageDocument }> => {
    const image = await Image.create({
      url: file.url,
      key: file.key,
      contentType: file.contentType,
      description: file.description ?? '',
      user,
    });

    if (!image) {
      throw new BadRequestError(t('images.errors.id.createMany'));
    }

    return {
      data: image,
    };
  };

  static createMany = async ({
    data: { files, user },
    t,
  }: CreateMany): Promise<{ data: ImageRecord[] }> => {
    const images = await Image.insertMany(
      files.map((file) => ({
        url: file.url,
        key: file.key,
        contentType: file.contentType,
        description: file.description ?? '',
        user,
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
  };
}
