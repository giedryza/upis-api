import { isValidObjectId } from 'mongoose';

import { Payload } from 'domain/companies/companies.types';
import { Company } from 'domain/companies/companies.model';
import { BadRequestError, NotFoundError } from 'errors';
import { filesService, QueryService, SlugService } from 'tools/services';
import { Utils } from 'tools/utils';

export class Service {
  static getAll = async ({ query }: Payload['getAll']) => {
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

  static getOne = async ({ id }: Payload['getOne']) => {
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

  static create = async ({ userId, body }: Payload['create']) => {
    const slug = await SlugService.get(body.name);

    const company = new Company({
      user: userId,
      slug,
      ...body,
    });

    await company.save();

    return { data: company };
  };

  static update = async ({ id, userId, body }: Payload['update']) => {
    if (!id) {
      throw new NotFoundError('Record not found.');
    }

    const slug = await SlugService.get(body.name ?? '');

    const filter = { _id: id, user: userId };
    const update = Utils.stripUndefined(body);
    const options = { new: true, runValidators: true };

    const company = await Company.findOneAndUpdate(
      filter,
      { ...update, ...(slug && { slug }) },
      options
    ).lean();

    if (!company) {
      throw new BadRequestError('Failed to update the record.');
    }

    return { data: company };
  };

  static destroy = async ({ id, userId }: Payload['destroy']) => {
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

  static addLogo = async ({ id, userId, file }: Payload['addLogo']) => {
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

  static deleteLogo = ({ logo }: Payload['cleanup']) => {
    if (logo) {
      filesService.delete(logo);
    }
  };
}
