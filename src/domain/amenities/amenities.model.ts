import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { currencies, ModelName, PriceDocument } from 'types/common';

import {
  variants,
  units,
  AmenityDocument,
  AmenityModel,
  AmenityRecord,
} from './amenities.types';

export const schema = new Schema<AmenityDocument, AmenityModel, AmenityRecord>(
  {
    variant: {
      type: String,
      enum: variants,
      required: true,
    },
    price: {
      type: new Schema<PriceDocument>({
        amount: {
          type: Number,
          min: 0,
          required: true,
        },
        currency: {
          type: String,
          enum: currencies,
          default: 'EUR',
        },
      }),
      default: null,
    },
    unit: {
      type: String,
      enum: units,
      default: 'tour',
    },
    info: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      virtuals: true,
    },
  }
);

schema.plugin(mongoosePaginate);

export const Amenity = model<AmenityDocument, AmenityModel>(
  ModelName.Amenity,
  schema
);
