import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { ModelName, languages, currencies, PriceDocument } from 'types/common';

import {
  TourDocument,
  TourModel,
  regions,
  boats,
  AmenityDocument,
  amenities,
  units,
  difficulty,
} from './tours.types';

const schema = new Schema<TourDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    departure: {
      type: String,
      required: true,
    },
    arrival: {
      type: String,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    days: {
      type: Number,
      default: 1,
    },
    rivers: {
      type: [String],
    },
    regions: {
      type: [{ type: String, enum: regions }],
    },
    difficulty: {
      type: Number,
      enum: difficulty,
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
      required: true,
    },
    amenities: {
      type: [
        new Schema<AmenityDocument>({
          kind: {
            type: String,
            enum: amenities,
            required: true,
          },
          price: {
            type: Number,
            min: 0,
            default: 0,
          },
          currency: {
            type: String,
            enum: currencies,
            default: 'EUR',
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
        }),
      ],
      // TODO
      // default: () => [],
      default: [],
    },
    photos: {
      type: [
        {
          location: {
            type: String,
            required: true,
          },
          key: {
            type: String,
          },
          contentType: {
            type: String,
          },
        },
      ],
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: ModelName.Company,
      required: true,
    },
    boats: {
      type: [{ type: String, enum: boats }],
    },
    languages: {
      type: [{ type: String, enum: languages }],
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

export const Tour = model<TourDocument, TourModel>(ModelName.Tour, schema);
