import { Document, PaginateModel } from 'mongoose';

import { AppFile, EntityId, Language, WithTimestamp } from 'types/common';
import { UserDocument } from 'domain/users/users.types';

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
  location?: {
    coordinates: number[];
  };
  logo: AppFile;
  amenities: EntityId[];
}

export interface CompanyDocument extends CompanyRecord, Document {}

export interface CompanyModel extends PaginateModel<CompanyDocument> {}
