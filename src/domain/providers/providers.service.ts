import { Request } from 'express';
import { LeanDocument } from 'mongoose';
import { TFunction } from 'i18next';

import { BadRequestError } from 'errors';
import { filesService, QueryService, SlugService } from 'tools/services';
import { EntityId, Language, PaginatedList } from 'types/common';

import { Provider } from './providers.model';
import { Boat, ProviderRecord } from './providers.types';

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
      populate: ['user', 'socialLinks', 'amenities'],
      lean: true,
      leanWithId: false,
    };

    const { docs, totalDocs: total } = await Provider.paginate(filter, options);

    return { data: docs, meta: { total, page, limit } };
  };

  static getOne = async ({
    data: { id },
  }: GetOne): Promise<{ data: LeanDocument<ProviderRecord> | null }> => {
    const company = await Provider.findById(id)
      .populate(['user', 'socialLinks', 'amenities'])
      .lean();

    if (!company) {
      return { data: null };
    }

    return { data: company };
  };

  static create = async ({
    data: { userId, name, phone, email, description },
    t,
  }: Create): Promise<{ data: ProviderRecord }> => {
    const slug = await SlugService.get(name);

    const company = new Provider({
      user: userId,
      slug,
      name,
      phone,
      email,
      description,
    });

    if (!company) {
      throw new BadRequestError(t('companies.errors.id.create'));
    }

    await company.save();

    return { data: company };
  };

  static update = async ({
    data,
    t,
  }: Update): Promise<{ data: LeanDocument<ProviderRecord> }> => {
    const slug = await SlugService.get(data.name ?? '');

    const { id, userId, languages, boats, location, ...update } = data;
    const filter = { _id: id, user: userId };

    const company = await Provider.findOneAndUpdate(
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

    if (!company) {
      throw new BadRequestError(t('companies.errors.id.update'));
    }

    return { data: company };
  };

  static destroy = async ({
    data: { id, userId },
    t,
  }: Destroy): Promise<void> => {
    const filter = { _id: id, user: userId };

    const company = await Provider.findOneAndDelete(filter).lean();

    if (!company) {
      throw new BadRequestError(t('companies.errors.id.destroy'));
    }

    Service.deleteLogo({ data: { logo: company.logo.key } });
  };

  static addLogo = async ({
    data: { id, userId, file },
    t,
  }: AddLogo): Promise<{ data: LeanDocument<ProviderRecord> }> => {
    if (!id || !file) {
      throw new BadRequestError(t('companies.errors.file.upload'));
    }

    const filter = { _id: id, user: userId };
    const update = {
      logo: {
        location: file.location,
        key: file.key,
        contentType: file.contentType,
      },
    };

    const company = await Provider.findOneAndUpdate(filter, update).lean();

    if (!company) {
      throw new BadRequestError(t('companies.errors.id.update'));
    }

    Service.deleteLogo({ data: { logo: company.logo.key } });

    return { data: { ...company, ...update } };
  };

  static deleteLogo = ({ data: { logo } }: Cleanup) => {
    if (logo) {
      filesService.delete([logo]);
    }
  };
}
