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

export interface SocialLinkConstructor {
  type: SocialLinkType;
  url: string;
  host: EntityId;
}

export interface SocialLinkRecord {
  type: SocialLinkType;
  url: string;
  host: EntityId;
}

export interface SocialLinkDocument extends SocialLinkRecord, Document {}

export interface SocialLinkModel extends PaginateModel<SocialLinkDocument> {
  construct: (payload: SocialLinkConstructor) => SocialLinkDocument;
}

export declare namespace Body {
  interface create {
    type: SocialLinkType;
    url: string;
    host: string;
  }

  interface update {
    type: SocialLinkType | undefined;
    url: string | undefined;
  }
}

export declare namespace Payload {
  interface getAll {
    query: Request['query'];
  }

  interface getOneById {
    id: string;
  }

  interface create {
    body: Body.create;
  }

  interface update {
    id: string;
    body: Body.update;
  }

  interface destroy {
    id: string;
  }
}
