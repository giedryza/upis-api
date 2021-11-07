import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { ModelName } from 'types/model';
import {
  CompanyConstructor,
  CompanyDocument,
  CompanyModel,
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

class SchemaLoader {
  // eslint-disable-next-line no-use-before-define
  static construct = (payload: CompanyConstructor) => new Company(payload);
}

schema.plugin(mongoosePaginate);
schema.virtual('socialLinks', {
  ref: ModelName.SocialLink,
  foreignField: 'host',
  localField: '_id',
});
schema.loadClass(SchemaLoader);

const Company = model<CompanyDocument, CompanyModel>(ModelName.Company, schema);

export { Company };
