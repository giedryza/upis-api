import { Schema } from 'mongoose';

import { PointDocument } from './geo.types';

export const pointSchema = new Schema<PointDocument>({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point',
  },
  coordinates: {
    type: [Number, Number],
    required: true,
  },
});
