import { Request } from 'express';
import { LeanDocument } from 'mongoose';
import { TFunction } from 'i18next';

import { BadRequestError } from 'errors';
import { EntityId, Language } from 'types/common';
import { filesService, QueryService, SlugService } from 'tools/services';
import { PaginatedList } from 'domain/pagination/pagination.types';

import { Provider } from './providers.model';
import { Boat, ProviderRecord, SocialVariant } from './providers.types';

interface GetAll {
  query: Request['query'];
}

interface GetOne {
  data: {
    id: string;
  };
}

interface Create {
  data: {
    userId: EntityId;
    name: string;
    phone: string;
    email: string;
    description?: string;
  };
  t: TFunction;
}

interface Update {
  data: {
    id: string;
    userId: EntityId;
    name?: string;
    phone?: string;
    email?: string;
    description?: string;
    website?: string;
    address?: string;
    location?: [number, number];
    languages?: Language[];
    boats?: Boat[];
  };
  t: TFunction;
}

interface Destroy {
  data: {
    id: string;
    userId: EntityId;
  };
  t: TFunction;
}

interface AddLogo {
  data: {
    id: string;
    userId: EntityId;
    file?: Request['file'];
  };
  t: TFunction;
}

interface CreateSocial {
  data: {
    id: string;
    type: SocialVariant;
    url: string;
  };
  t: TFunction;
}

interface UpdateSocial {
  data: {
    id: string;
    social: {
      id: string;
      type: SocialVariant;
      url: string;
    };
  };
  t: TFunction;
}

interface DestroySocial {
  data: {
    providerId: string;
    socialId: string;
  };
  t: TFunction;
}

interface Cleanup {
  data: {
    logo?: string;
  };
}

export class Service {
  static getAll = async ({
    query,
  }: GetAll): Promise<PaginatedList<ProviderRecord>> => {
    const { filter, sort, select, page, limit } = new QueryService(query);
    const options = {
      page,
      limit,
      sort,
      select,
      populate: ['user', 'amenities'],
      lean: true,
      leanWithId: false,
    };

    const { docs, totalDocs, totalPages } = await Provider.paginate(
      filter,
      options
    );

    return {
      data: docs,
      meta: { total: totalDocs, page, limit, pages: totalPages },
    };
  };

  static getOne = async ({
    data: { id },
  }: GetOne): Promise<{ data: LeanDocument<ProviderRecord> | null }> => {
    const provider = await Provider.findById(id)
      .populate(['user', 'amenities'])
      .lean();

    if (!provider) {
      return { data: null };
    }

    return { data: provider };
  };

  static create = async ({
    data: { userId, name, phone, email, description },
    t,
  }: Create): Promise<{ data: ProviderRecord }> => {
    const slug = await SlugService.get(name);

    const provider = new Provider({
      user: userId,
      slug,
      name,
      phone,
      email,
      description,
    });

    if (!provider) {
      throw new BadRequestError(t('providers.errors.id.create'));
    }

    await provider.save();

    return { data: provider };
  };

  static update = async ({
    data,
    t,
  }: Update): Promise<{ data: LeanDocument<ProviderRecord> }> => {
    const slug = await SlugService.get(data.name ?? '');

    const { id, userId, languages, boats, location, ...update } = data;
    const filter = { _id: id, user: userId };

    const provider = await Provider.findOneAndUpdate(
      filter,
      {
        ...update,
        ...{
          $set: {
            ...(!!slug && { slug }),
            ...(!!location && { 'location.coordinates': location }),
            ...(!!languages && { languages }),
            ...(!!boats && { boats }),
          },
        },
      },
      { new: true, runValidators: true }
    ).lean();

    if (!provider) {
      throw new BadRequestError(t('providers.errors.id.update'));
    }

    return { data: provider };
  };

  static destroy = async ({
    data: { id, userId },
    t,
  }: Destroy): Promise<void> => {
    const filter = { _id: id, user: userId };

    const provider = await Provider.findOneAndDelete(filter).lean();

    if (!provider) {
      throw new BadRequestError(t('providers.errors.id.destroy'));
    }

    Service.deleteLogo({ data: { logo: provider.logo.key } });
  };

  static addLogo = async ({
    data: { id, userId, file },
    t,
  }: AddLogo): Promise<{ data: LeanDocument<ProviderRecord> }> => {
    if (!id || !file) {
      throw new BadRequestError(t('providers.errors.file.upload'));
    }

    const filter = { _id: id, user: userId };
    const update = {
      logo: {
        location: file.path,
        key: file.filename,
        contentType: file.mimetype,
      },
    };

    const provider = await Provider.findOneAndUpdate(filter, update).lean();

    if (!provider) {
      throw new BadRequestError(t('providers.errors.id.update'));
    }

    Service.deleteLogo({ data: { logo: provider.logo.key } });

    return { data: { ...provider, ...update } };
  };

  static createSocial = async ({
    data,
    t,
  }: CreateSocial): Promise<{ data: LeanDocument<ProviderRecord> }> => {
    const provider = await Provider.findOneAndUpdate(
      { _id: data.id },
      {
        $push: {
          socials: {
            type: data.type,
            url: data.url,
          },
        },
      }
    ).lean();

    if (!provider) {
      throw new BadRequestError(t('socials.errors.id.create'));
    }

    return { data: provider };
  };

  static updateSocial = async ({
    data,
    t,
  }: UpdateSocial): Promise<{ data: ProviderRecord }> => {
    const { id, social } = data;

    const provider = await Provider.findOneAndUpdate(
      { _id: id, 'socials._id': social.id },
      {
        $set: {
          'socials.$': { _id: social.id, type: social.type, url: social.url },
        },
      },
      { new: true }
    );

    if (!provider) {
      throw new BadRequestError(t('socials.errors.id.update'));
    }

    return { data: provider };
  };

  static destroySocial = async ({
    data: { providerId, socialId },
    t,
  }: DestroySocial): Promise<{ data: ProviderRecord }> => {
    const provider = await Provider.findOneAndUpdate(
      {
        _id: providerId,
        'socials._id': socialId,
      },
      {
        $pull: { socials: { _id: socialId } },
      }
    );

    if (!provider) {
      throw new BadRequestError(t('socials.errors.id.destroy'));
    }

    return { data: provider };
  };

  static deleteLogo = ({ data: { logo } }: Cleanup) => {
    if (logo) {
      filesService('cloudinary').delete([logo]);
    }
  };
}
