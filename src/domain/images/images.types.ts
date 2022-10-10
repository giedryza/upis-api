import { Document, Model } from 'mongoose';

import { WithTimestamp } from 'types/common';

export interface ImageRecord extends WithTimestamp {
  url: string;
  key: string;
  contentType: string;
  description: string;
}

export interface ImageDocument extends ImageRecord, Document {}

export interface ImageModel extends Model<ImageDocument> {}
