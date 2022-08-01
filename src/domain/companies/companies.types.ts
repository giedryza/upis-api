import { Request } from 'express';
import { Document, PaginateModel, Types } from 'mongoose';

import { AppFile, EntityId, PriceRecord, WithTimestamp } from 'types/common';
import { UserDocument } from 'domain/users/users.types';

export const amenityVariants = [
  'transport',
  'child-seat',
  'life-vest',
  'phone-case',
  'dry-bag',
  'tent',
  'sleeping-bag',
  'grill',
  'guide',
  'camera',
  'pet-friendly',
] as const;

export const units = ['tour', 'day', 'h', 'km'] as const;

export type AmenityVariant = typeof amenityVariants[number];

export type Unit = typeof units[number];

export interface AmenityRecord {
  variant: AmenityVariant;
  price: PriceRecord | null;
  unit: Unit;
  info: string;
}

export interface AmenityDocument extends AmenityRecord, Types.Subdocument {}

export interface CompanyRecord extends WithTimestamp {
  name: string;
  phone: string;
  email: string;
  slug: string;
  description?: string;
  website?: string;
  address?: string;
  user: EntityId | UserDocument;
  location?: {
    coordinates: number[];
  };
  logo: AppFile;
  amenities: AmenityDocument[];
}

export interface CompanyDocument extends CompanyRecord, Document {}

export interface CompanyModel extends PaginateModel<CompanyDocument> {}

export interface Body {
  create: {
    name: string;
    phone: string;
    email: string;
    description?: string;
  };
  update: {
    name: string | undefined;
    phone: string | undefined;
    email: string | undefined;
    description: string | undefined;
    website: string | undefined;
    address: string | undefined;
    location: { coordinates: number[] } | undefined;
  };
}

export interface Payload {
  getAll: {
    query: Request['query'];
  };
  getOne: {
    id: string;
  };
  create: {
    userId: string;
    body: Body['create'];
  };
  update: {
    id: string;
    userId: string;
    body: Body['update'];
  };
  destroy: {
    id: string;
    userId: string;
  };
  addLogo: {
    id: string;
    userId: string;
    file?: Request['file'];
  };
  cleanup: {
    logo?: string;
  };
}
