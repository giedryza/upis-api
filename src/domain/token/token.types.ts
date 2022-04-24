import { Document, Model } from 'mongoose';

import { EntityId } from 'types/common';

export interface TokenRecord {
  user: EntityId;
  token: string;
  expireAt: Date;
}

export interface TokenDocument extends TokenRecord, Document {}

export interface TokenModel extends Model<TokenDocument> {}
