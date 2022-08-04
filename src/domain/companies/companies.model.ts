import { Schema, model, Query } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { ModelName } from 'types/common';
import { Tour } from 'domain/tours/tours.model';
import {
  CompanyDocument,
  CompanyModel,
  CompanyRecord,
} from 'domain/companies/companies.types';

const schema = new Schema<CompanyDocument, CompanyModel, CompanyRecord>(
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
schema.virtual('socialLinks', {
  ref: ModelName.SocialLink,
  foreignField: 'host',
  localField: '_id',
});

schema.post<Query<CompanyDocument | null, CompanyDocument>>(
  'findOneAndDelete',
  async (doc, next) => {
    if (!doc) return next();

    await Tour.deleteMany({ company: doc._id });

    next();
  }
);

export const Company = model<CompanyDocument, CompanyModel>(
  ModelName.Company,
  schema
);
