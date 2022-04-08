import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { ModelName } from 'types/common';
import {
  SocialLinkDocument,
  SocialLinkModel,
  SocialLinkType,
  SocialLinkRecord,
} from 'domain/social-links/social-links.types';

const schema = new Schema<
  SocialLinkDocument,
  SocialLinkModel,
  SocialLinkRecord
>(
  {
    type: {
      type: String,
      enum: Object.values(SocialLinkType),
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    host: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    toJSON: {
      versionKey: false,
    },
  }
);

schema.plugin(mongoosePaginate);

const SocialLink = model<SocialLinkDocument, SocialLinkModel>(
  ModelName.SocialLink,
  schema,
  'social-links'
);

export { SocialLink };
