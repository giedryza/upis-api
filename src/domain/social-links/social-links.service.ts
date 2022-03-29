import { Payload } from 'domain/social-links/social-links.types';
import { SocialLink } from 'domain/social-links/social-links.model';
import { NotFoundError, BadRequestError } from 'errors';
import { Utils } from 'common/utils';
import { Query } from 'common/query';

export class Service {
  static getAll = async ({ query }: Payload.getAll) => {
    const { filter, sort, select, page, limit } = new Query(query);
    const options = {
      page,
      limit,
      sort,
      select,
      lean: true,
      leanWithId: false,
    };

    const { docs, totalDocs: total } = await SocialLink.paginate(
      filter,
      options
    );

    return { data: docs, meta: { total, page, limit } };
  };

  static getOneById = async ({ id }: Payload.getOneById) => {
    if (!id) {
      throw new NotFoundError('Record not found.');
    }

    const socialLink = await SocialLink.findById(id).lean();

    if (!socialLink) {
      throw new NotFoundError('Record not found.');
    }

    return { data: socialLink };
  };

  static create = async ({ body }: Payload.create) => {
    const socialLink = new SocialLink(body);

    await socialLink.save();

    return { data: socialLink };
  };

  static update = async ({ id, body }: Payload.update) => {
    if (!id) {
      throw new NotFoundError('Record not found.');
    }

    const filter = { _id: id };
    const update = Utils.stripUndefined(body);
    const options = { new: true };

    const socialLink = await SocialLink.findOneAndUpdate(
      filter,
      update,
      options
    ).lean();

    if (!socialLink) {
      throw new BadRequestError('Failed to update the record.');
    }

    return { data: socialLink };
  };

  static destroy = async ({ id }: Payload.destroy) => {
    if (!id) {
      throw new NotFoundError('Record not found.');
    }

    const socialLink = await SocialLink.findByIdAndDelete(id).lean();

    if (!socialLink) {
      throw new BadRequestError('Failed to update the record.');
    }
  };
}
