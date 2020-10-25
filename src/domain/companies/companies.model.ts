import { Schema, model } from 'mongoose';
import {
  CompanyConstructor,
  CompanyDocument,
  CompanyModel,
  SocialType,
} from 'domain/companies/companies.types';

const schema = new Schema(
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
    description: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    social: [
      {
        type: {
          type: String,
          enum: Object.values(SocialType),
          required: true,
        },
        link: {
          type: String,
          required: true,
        },
      },
    ],
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
      type: String,
      default: '',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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

schema.statics.construct = (payload: CompanyConstructor) =>
  // eslint-disable-next-line no-use-before-define
  new Company(payload);

const Company = model<CompanyDocument, CompanyModel>('Company', schema);

export { Company };
