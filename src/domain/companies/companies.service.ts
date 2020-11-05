import { Payload } from 'domain/companies/companies.types';
import { Company } from 'domain/companies/companies.model';
import { BadRequestError } from 'errors/bad-request.error';
import { fileStorage } from 'utils/file-storage';
import { Basics } from 'utils/basics';
import { NotFoundError } from 'errors/not-found.error';
import { Query } from 'utils/query';

export class Service {
  static getAll = async ({ query }: Payload.getAll) => {
    const { filter, sort, select, page, limit } = new Query(query);

    const { docs, totalDocs: total } = await Company.paginate(filter, {
      page,
      limit,
      sort,
      select,
    });

    return { data: docs, meta: { total, page, limit } };
  };

  static getOne = async ({ id }: Payload.getOne) => {
    const company = await Company.findById(id).lean();

    if (!company) {
      throw new NotFoundError('Record not found.');
    }

    return { data: company };
  };

  static create = async ({ userId, body }: Payload.create) => {
    const company = Company.construct({
      user: userId,
      ...body,
    });

    await company.save();

    return { data: company };
  };

  static update = async ({ id, userId, body }: Payload.update) => {
    const filter = { _id: id, user: userId };
    const update = Basics.stripUndefined(body);
    const options = { new: true };

    const company = await Company.findOneAndUpdate(
      filter,
      update,
      options
    ).lean();

    if (!company) {
      throw new BadRequestError('Failed to update the record.');
    }

    return { data: company };
  };

  static destroy = async ({ id, userId }: Payload.destroy) => {
    const filter = { _id: id, user: userId };

    const company = await Company.findOneAndDelete(filter).lean();

    if (!company) {
      throw new BadRequestError('Failed to update the record.');
    }

    const logo = company.logo.key;

    if (logo) {
      fileStorage.delete(logo);
    }
  };

  static addLogo = async ({ id, userId, file }: Payload.addLogo) => {
    if (!file) {
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

    const logo = company.logo.key;

    if (logo) {
      fileStorage.delete(logo);
    }

    return { data: { ...company, ...update } };
  };
}
