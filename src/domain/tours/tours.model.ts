import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { ModelName, languages, currencies, PriceDocument } from 'types/common';

import {
  TourDocument,
  TourModel,
  regions,
  boats,
  AmenityDocument,
  amenityVariants,
  units,
} from './tours.types';

const schema = new Schema<TourDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    departure: {
      type: String,
      default: '',
    },
    arrival: {
      type: String,
      default: '',
    },
    distance: {
      type: Number,
      default: null,
    },
    duration: {
      type: Number,
      default: null,
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
      default: null,
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
    amenities: {
      type: [
        new Schema<AmenityDocument>({
          variant: {
            type: String,
            enum: amenityVariants,
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
    user: {
      type: Schema.Types.ObjectId,
      ref: ModelName.User,
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
