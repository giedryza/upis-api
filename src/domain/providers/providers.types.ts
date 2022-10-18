import { Document, PaginateModel } from 'mongoose';

import { AppFile, EntityId, Language, WithTimestamp } from 'types/common';
import { UserDocument } from 'domain/users/users.types';

export const boats = [
  'single-kayak',
  'double-kayak',
  'triple-kayak',
  'raft',
] as const;

export type Boat = typeof boats[number];

export interface CompanyRecord extends WithTimestamp {
  name: string;
  phone: string;
  email: string;
  slug: string;
  description?: string;
  website?: string;
  address?: string;
  user: EntityId | UserDocument;
  languages: Language[];
  boats: Boat[];
  location?: {
    coordinates: number[];
  };
  logo: AppFile;
  amenities: EntityId[];
}

export interface CompanyDocument extends CompanyRecord, Document {}

export interface CompanyModel extends PaginateModel<CompanyDocument> {}
