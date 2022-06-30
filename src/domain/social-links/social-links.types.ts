import { Request } from 'express';
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

export interface Body {
  create: {
    type: SocialLinkType;
    url: string;
    host: string;
  };
  update: {
    type: SocialLinkType | undefined;
    url: string | undefined;
  };
}

export interface Payload {
  getAll: {
    query: Request['query'];
  };
  getOneById: {
    id: string;
  };
  create: {
    body: Body['create'];
  };
  update: {
    id: string;
    body: Body['update'];
  };
  destroy: {
    id: string;
  };
}
