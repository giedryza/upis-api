import { PaginateModel, Types } from 'mongoose';

import { PriceRecord, WithTimestamp } from 'types/common';

export const variants = [
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

export type Variant = typeof variants[number];

export type Unit = typeof units[number];

export interface AmenityRecord extends WithTimestamp {
  variant: Variant;
  price: PriceRecord | null;
  unit: Unit;
  info: string;
}

export interface AmenityDocument extends AmenityRecord, Types.Subdocument {}

export interface AmenityModel extends PaginateModel<AmenityDocument> {}
