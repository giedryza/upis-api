import { Document, Model, Types } from 'mongoose';
import { WithTimestamp } from 'types/mongoose';
import { UserDocument } from 'domain/users/users.types';

export enum SocialType {
  Facebook = 'facebook',
  Instagram = 'instagram',
  Youtube = 'youtube',
  Linkedin = 'linkedin',
  Twitter = 'twitter',
}

interface Social {
  type: SocialType;
  link: string;
}

export interface CompanyConstructor {
  user: string;
  name: string;
  phone: string;
  email: string;
  description?: string;
}

export interface CompanyDocument extends Document, WithTimestamp {
  name: string;
  phone: string;
  email: string;
  description?: string;
  website?: string;
  social?: Social[];
  address?: string;
  user: Types.ObjectId | UserDocument;
  location?: {
    coordinates: number[];
  };
  logo?: string;
}

export interface CompanyModel extends Model<CompanyDocument> {
  construct(payload: CompanyConstructor): CompanyDocument;
}

export declare namespace Body {
  interface create {
    name: string;
    phone: string;
    email: string;
    description?: string;
  }
}

export declare namespace Payload {
  interface getOne {
    document: CompanyDocument;
  }

  interface create {
    user: string;
    name: string;
    phone: string;
    email: string;
    description?: string;
  }

  interface update {
    document: CompanyDocument;
    name?: string;
    phone?: string;
    email?: string;
    description?: string;
    website?: string;
    social?: Social[];
    address?: string;
    location?: {
      coordinates: number[];
    };
  }

  interface destroy {
    document: CompanyDocument;
  }

  interface addLogo {
    document: CompanyDocument;
    logo?: string;
  }
}
