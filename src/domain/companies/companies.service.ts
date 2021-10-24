import { Payload } from 'domain/companies/companies.types';
import { Company } from 'domain/companies/companies.model';
import { RESERVED_SLUGS } from 'domain/companies/companies.constants';
import { BadRequestError } from 'errors/bad-request.error';
import { NotFoundError } from 'errors/not-found.error';
import { UnauthorizedError } from 'errors/unauthorized.error';
import { fileStorage } from 'common/file-storage';
import { Utils } from 'common/utils';
import { Query } from 'common/query';
import { Slug } from 'common/slug';

export class Service {
  static getAll = async ({ query }: Payload.getAll) => {
    const { filter, sort, select, page, limit } = new Query(query);
    const options = {
      page,
      limit,
      sort,
      select,
      populate: ['user', 'socialLinks'],
      lean: true,
      leanWithId: false,
    };

    const { docs, totalDocs: total } = await Company.paginate(filter, options);

    return { data: docs, meta: { total, page, limit } };
  };

  static getOneByUser = async ({ user }: Payload.getOneByUser) => {
    if (!user) {
      throw new UnauthorizedError();
    }

    const company = await Company.findOne({ user: user._id })
      .populate('socialLinks')
      .lean();

    return { data: company ?? null };
  };

  static getOneBySlug = async ({ slug }: Payload.getOneBySlug) => {
    if (!slug) {
      throw new NotFoundError('Record not found.');
    }

    const company = await Company.findOne({ slug })
      .populate(['user', 'socialLinks'])
      .lean();

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

    const slug = await Slug.get(company.name);

    if (!slug || RESERVED_SLUGS.includes(slug)) {
      throw new BadRequestError('Invalid company name. Try another.');
    }

    const taken = await Company.findOne({ slug }).lean();

    if (taken) {
      throw new BadRequestError('Company name is taken. Try another.');
    }

    company.set('slug', slug);

    await company.save();

    return { data: company };
  };

  static update = async ({ id, userId, body }: Payload.update) => {
    if (!id) {
      throw new NotFoundError('Record not found.');
    }

    const filter = { _id: id, user: userId };
    const update = Utils.stripUndefined(body);
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
    if (!id) {
      throw new NotFoundError('Record not found.');
    }

    const filter = { _id: id, user: userId };

    const company = await Company.findOneAndDelete(filter).lean();

    if (!company) {
      throw new BadRequestError('Failed to update the record.');
    }

    Service.deleteLogo({ logo: company.logo.key });
  };

  static addLogo = async ({ id, userId, file }: Payload.addLogo) => {
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

  static deleteLogo = ({ logo }: Payload.cleanup) => {
    if (logo) {
      fileStorage.delete(logo);
    }
  };
}
