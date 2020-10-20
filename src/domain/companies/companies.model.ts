import mongoose from 'mongoose';
import {
  ConstructorPayload,
  Document,
  Model,
  SocialType,
} from 'domain/companies/companies.types';

const schema = new mongoose.Schema(
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
    },
    website: {
      type: String,
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
    user: {
      type: mongoose.Schema.Types.ObjectId,
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

schema.statics.construct = (payload: ConstructorPayload) =>
  // eslint-disable-next-line no-use-before-define
  new Company(payload);

const Company = mongoose.model<Document, Model>('Company', schema);

export { Company };
