import { Document, PaginateModel } from 'mongoose';

import { AppFile, EntityId, Language, WithTimestamp } from 'types/common';
import { UserDocument } from 'domain/users/users.types';

export const boats = [
  'single-kayak',
  'double-kayak',
  'triple-kayak',
  'raft',
] as const;

export type Boat = (typeof boats)[number];

export const socials = [
  'facebook',
  'instagram',
  'youtube',
  'linkedin',
  'twitter',
] as const;

export type SocialVariant = (typeof socials)[number];

export interface SocialLinkRecord {
  type: SocialVariant;
  url: string;
  host: EntityId;
}

export interface SocialLinkDocument extends SocialLinkRecord, Document {}

export const queryUtils = {
  select: ['_id', 'name'],
} as const;

export interface ProviderRecord extends WithTimestamp {
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
  socials: SocialLinkRecord[];
}

export interface ProviderDocument extends ProviderRecord, Document {}

export interface ProviderModel extends PaginateModel<ProviderDocument> {}
