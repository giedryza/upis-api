import { Schema, model, Query } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { currencies, ModelName, PriceDocument } from 'types/common';
import { Company } from 'domain/providers/providers.model';
import { Tour } from 'domain/tours/tours.model';

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
    user: {
      type: Schema.Types.ObjectId,
      ref: ModelName.User,
      required: true,
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

schema.post<Query<AmenityDocument | null, AmenityDocument>>(
  'findOneAndDelete',
  async (doc, next) => {
    if (!doc) return next();

    await Promise.all([
      Company.updateMany(
        { amenities: doc._id },
        { $pull: { amenities: doc._id } }
      ),
      Tour.updateMany(
        { amenities: doc._id },
        { $pull: { amenities: doc._id } }
      ),
    ]);

    next();
  }
);

export const Amenity = model<AmenityDocument, AmenityModel>(
  ModelName.Amenity,
  schema
);
