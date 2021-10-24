import { Payload } from 'domain/social-links/social-links.types';
import { SocialLink } from 'domain/social-links/social-links.model';

export class Service {
  static create = async ({ body }: Payload.create) => {
    const socialLink = SocialLink.construct(body);

    await socialLink.save();

    return { data: socialLink };
  };
}
