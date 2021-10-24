import { Payload } from 'domain/social-links/social-links.types';
import { SocialLink } from 'domain/social-links/social-links.model';
import { NotFoundError } from 'errors/not-found.error';
import { BadRequestError } from 'errors/bad-request.error';

export class Service {
  static create = async ({ body }: Payload.create) => {
    const socialLink = SocialLink.construct(body);

    await socialLink.save();

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
