import { Document, PaginateModel } from 'mongoose';

import { EntityId } from 'types/common';

export enum SocialLinkType {
  Facebook = 'facebook',
  Instagram = 'instagram',
  Youtube = 'youtube',
  Linkedin = 'linkedin',
  Twitter = 'twitter',
}

export interface SocialLinkRecord {
  type: SocialLinkType;
  url: string;
  host: EntityId;
}

export interface SocialLinkDocument extends SocialLinkRecord, Document {}

export interface SocialLinkModel extends PaginateModel<SocialLinkDocument> {}
