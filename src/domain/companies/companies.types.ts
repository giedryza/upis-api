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
    id: string;
  }

  interface create {
    user: string;
    name: string;
    phone: string;
    email: string;
    description?: string;
  }

  interface update {
    id: string;
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
    logo?: string;
  }

  interface destroy {
    id: string;
  }

  interface addLogo {
    id: string;
    logo?: string;
  }
}
