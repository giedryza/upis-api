import { Schema, model, Query } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { ModelName, languages } from 'types/common';
import { Tour } from 'domain/tours/tours.model';
import { Amenity } from 'domain/amenities/amenities.model';

import {
  boats,
  ProviderDocument,
  ProviderModel,
  SocialLinkDocument,
  socials,
} from './providers.types';

const schema = new Schema<ProviderDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
      },
    },
    logo: {
      location: {
        type: String,
        default: '',
      },
      key: {
        type: String,
      },
      contentType: {
        type: String,
      },
    },
    languages: {
      type: [{ type: String, enum: languages }],
    },
    boats: {
      type: [{ type: String, enum: boats }],
    },
    amenities: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: ModelName.Amenity,
          required: true,
        },
      ],
      default: [],
    },
    socials: {
      type: [
        new Schema<SocialLinkDocument>({
          type: {
            type: String,
            enum: socials,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
        }),
      ],
      default: [],
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

schema.plugin(mongoosePaginate);

schema.post<Query<ProviderDocument | null, ProviderDocument>>(
  'findOneAndDelete',
  async (doc, next) => {
    if (!doc) return next();

    await Promise.all([
      Tour.deleteMany({ provider: doc._id }),
      Amenity.deleteMany({ _id: { $in: doc.amenities } }),
    ]);

    next();
  }
);

export const Provider = model<ProviderDocument, ProviderModel>(
  ModelName.Provider,
  schema
);
