import { Types } from 'mongoose';

export const currencies = ['EUR'] as const;

export type Currency = (typeof currencies)[number];

export interface PriceRecord {
  amount: number;
  currency: Currency;
}

export interface PriceDocument extends PriceRecord, Types.Subdocument {}
