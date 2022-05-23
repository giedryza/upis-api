import { Document, PaginateModel, Types } from 'mongoose';

import {
  AppFile,
  Currency,
  EntityId,
  Language,
  PriceRecord,
  WithTimestamp,
} from 'types/common';

export const regions = [
  'aukstaitija',
  'dzukija',
  'mazoji-lietuva',
  'suvalkija',
  'zemaitija',
] as const;

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

export const boats = ['single-kayak', 'double-kayak', 'triple-kayak'] as const;

export const units = ['tour', 'day', 'h', 'km'] as const;

export const difficulty = [1, 2, 3, 4, 5] as const;

export type Region = typeof regions[number];

export type AmenityVariant = typeof amenityVariants[number];

export type Boat = typeof boats[number];

export type Unit = typeof units[number];

export type Difficulty = typeof difficulty[number];

export interface AmenityRecord {
  variant: AmenityVariant;
  price: number;
  currency: Currency;
  unit: Unit;
  info: string;
}

export interface AmenityDocument extends AmenityRecord, Types.Subdocument {}

export interface TourRecord extends WithTimestamp {
  name: string;
  description: string;
  departure: string;
  arrival: string;
  distance: number;
  duration: number;
  days: number;
  rivers: string[];
  regions: Region[];
  difficulty: Difficulty;
  price: PriceRecord;
  photos: AppFile[];
  company: EntityId;
  amenities: AmenityRecord[];
  boats: Boat[];
  languages: Language[];
}

export interface TourDocument extends TourRecord, Document {}

export interface TourModel extends PaginateModel<TourDocument> {}
