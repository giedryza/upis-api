import { Request } from 'express';
import { isValidObjectId } from 'mongoose';

import { Company } from 'domain/companies/companies.model';
import { BadRequestError, NotFoundError } from 'errors';
import { filesService, QueryService, SlugService } from 'tools/services';
import { Language } from 'types/common';

interface GetAll {
  query: Request['query'];
}

interface GetOne {
  id: string;
}

interface Create {
  userId: string;
  body: {
    name: string;
    phone: string;
    email: string;
    description?: string;
  };
}

interface Update {
  id: string;
  userId: string;
  body: {
    name?: string;
    phone?: string;
    email?: string;
    description?: string;
    website?: string;
    address?: string;
    location?: { coordinates: number[] };
    languages?: Language[];
  };
}

interface Destroy {
  id: string;
  userId: string;
}

interface AddLogo {
  id: string;
  userId: string;
  file?: Request['file'];
}

interface Cleanup {
  logo?: string;
}

export class Service {
  static getAll = async ({ query }: GetAll) => {
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

    const { docs, totalDocs: total } = await Company.paginate(filter, options);

    return { data: docs, meta: { total, page, limit } };
  };

  static getOne = async ({ id }: GetOne) => {
    if (!id) {
      throw new BadRequestError('Missing property: {id}.');
    }

    if (!isValidObjectId(id)) {
      return { data: null };
    }

    const company = await Company.findById(id)
      .populate(['user', 'socialLinks', 'amenities'])
      .lean();

    if (!company) {
      return { data: null };
    }

    return { data: company };
  };

  static create = async ({ userId, body }: Create) => {
    const slug = await SlugService.get(body.name);

    const company = new Company({
      user: userId,
      slug,
      ...body,
    });

    await company.save();

    return { data: company };
  };

  static update = async ({ id, userId, body }: Update) => {
    const slug = await SlugService.get(body.name ?? '');

    const filter = { _id: id, user: userId };
    const { languages, ...update } = body;
    const options = { new: true, runValidators: true };

    const company = await Company.findOneAndUpdate(
      filter,
      {
        ...update,
        ...{
          $set: {
            ...(!!languages && { languages }),
          },
        },
        ...(slug && { slug }),
      },
      options
    ).lean();

    if (!company) {
      throw new BadRequestError('Failed to update the record.');
    }

    return { data: company };
  };

  static destroy = async ({ id, userId }: Destroy) => {
    if (!id) {
      throw new NotFoundError('Record not found.');
    }

    const filter = { _id: id, user: userId };

    const company = await Company.findOneAndDelete(filter).lean();

    if (!company) {
      throw new BadRequestError('Failed to delete the record.');
    }

    Service.deleteLogo({ logo: company.logo.key });
  };

  static addLogo = async ({ id, userId, file }: AddLogo) => {
    if (!id || !file) {
      throw new BadRequestError('File upload failed. Try again.');
    }

    const filter = { _id: id, user: userId };
    const update = {
      logo: {
        location: file.location,
        key: file.key,
        contentType: file.contentType,
      },
    };

    const company = await Company.findOneAndUpdate(filter, update).lean();

    if (!company) {
      throw new BadRequestError('Failed to update the record.');
    }

    Service.deleteLogo({ logo: company.logo.key });

    return { data: { ...company, ...update } };
  };

  static deleteLogo = ({ logo }: Cleanup) => {
    if (logo) {
      filesService.delete(logo);
    }
  };
}
