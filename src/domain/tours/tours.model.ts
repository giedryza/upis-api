import { Schema, model, Query } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { filesService } from 'tools/services';
import { ModelName, currencies, PriceDocument } from 'types/common';
import { Image } from 'domain/images/images.model';
import { variants } from 'domain/amenities/amenities.types';

import { TourDocument, TourModel, regions, rivers } from './tours.types';
import { calculateScore } from './tours.utils';

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
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
      },
    },
    arrival: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
      },
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
    difficulty: {
      type: Number,
      default: 2.5,
    },
    rivers: {
      type: [{ type: String, enum: rivers }],
    },
    regions: {
      type: [{ type: String, enum: regions }],
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
        {
          _id: {
            type: Schema.Types.ObjectId,
            ref: ModelName.Amenity,
            required: true,
          },
          variant: {
            type: String,
            enum: variants,
            required: true,
          },
        },
      ],
      default: [],
    },
    photos: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: ModelName.Image,
          required: true,
        },
      ],
      default: [],
    },
    primaryPhoto: {
      type: String,
      default: '',
    },
    score: {
      type: Number,
      default: 0,
    },
    provider: {
      type: Schema.Types.ObjectId,
      ref: ModelName.Provider,
      required: true,
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
    },
  }
);

schema.index({ departure: '2dsphere' });

schema.plugin(mongoosePaginate);

schema.post<Query<TourDocument | null, TourDocument>>(
  'findOneAndDelete',
  async (doc, next) => {
    if (!doc) return next();

    const photos = await Image.find({ _id: { $in: doc.photos } }).lean();

    await Promise.all([
      Image.deleteMany({ _id: { $in: doc.photos } }),
      filesService('cloudinary').delete(photos.map((photo) => photo.key)),
    ]);

    next();
  }
);

schema.pre('save', async function (next) {
  this.set('score', calculateScore(this));

  next();
});

export const Tour = model<TourDocument, TourModel>(ModelName.Tour, schema);
