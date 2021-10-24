import { Payload } from 'domain/social-links/social-links.types';
import { SocialLink } from 'domain/social-links/social-links.model';
import { NotFoundError } from 'errors/not-found.error';
import { BadRequestError } from 'errors/bad-request.error';
import { Utils } from 'common/utils';

export class Service {
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
    const socialLink = SocialLink.construct(body);

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
