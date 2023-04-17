import { PaginateModel, Types } from 'mongoose';

import { EntityId, PriceRecord, WithTimestamp } from 'types/common';

export const variants = [
  'transport',
  'child-seat',
  'life-vest',
  'phone-case',
  'dry-bag',
  'tent',
  'sleeping-bag',
  'grill',
  'map',
  'guide',
  'camera',
  'pet-friendly',
] as const;

export const units = ['tour', 'person', 'day', 'h', 'km'] as const;

export type Variant = (typeof variants)[number];

export type Unit = (typeof units)[number];

export interface AmenityRecord extends WithTimestamp {
  variant: Variant;
  price: PriceRecord | null;
  unit: Unit;
  info: string;
  user: EntityId;
}

export interface AmenityDocument extends AmenityRecord, Types.Subdocument {}

export interface AmenityModel extends PaginateModel<AmenityDocument> {}
