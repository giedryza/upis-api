import { Request } from 'express';
import { Document, Types, PaginateModel } from 'mongoose';
import { WithTimestamp } from 'types/model';
import { UserDocument } from 'domain/users/users.types';

export interface CompanyConstructor {
  user: string;
  name: string;
  phone: string;
  email: string;
  description?: string;
}

export interface CompanyRecord extends WithTimestamp {
  name: string;
  phone: string;
  email: string;
  slug: string;
  description?: string;
  website?: string;
  address?: string;
  user: Types.ObjectId | UserDocument;
  location?: {
    coordinates: number[];
  };
  logo: {
    location: string;
    key?: string;
    contentType?: string;
  };
}

export interface CompanyDocument extends CompanyRecord, Document {}

export interface CompanyModel extends PaginateModel<CompanyDocument> {
  construct: (payload: CompanyConstructor) => CompanyDocument;
}

export declare namespace Body {
  interface create {
    name: string;
    phone: string;
    email: string;
    description?: string;
  }

  interface update {
    name: string | undefined;
    phone: string | undefined;
    email: string | undefined;
    description: string | undefined;
    website: string | undefined;
    address: string | undefined;
    location: { coordinates: number[] } | undefined;
  }
}

export declare namespace Payload {
  interface getAll {
    query: Request['query'];
  }

  interface getOneBySlug {
    slug: string;
  }

  interface create {
    userId: string;
    body: Body.create;
  }

  interface update {
    id: string;
    userId: string;
    body: Body.update;
  }

  interface destroy {
    id: string;
    userId: string;
  }

  interface addLogo {
    id: string;
    userId: string;
    file?: Request['file'];
  }

  interface cleanup {
    logo?: string;
  }
}
