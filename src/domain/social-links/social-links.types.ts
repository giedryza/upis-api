import { Document, PaginateModel } from 'mongoose';

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
  host: string;
}

export interface SocialLinkRecord {
  type: SocialLinkType;
  url: string;
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
  interface create {
    body: Body.create;
  }
}
