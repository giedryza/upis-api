import { Schema, model } from 'mongoose';
import { ModelName } from 'types/model';
import {
  SocialLinkConstructor,
  SocialLinkDocument,
  SocialLinkModel,
  SocialLinkType,
} from 'domain/social-links/social-links.types';

const schema = new Schema(
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

class SchemaLoader {
  static construct = (payload: SocialLinkConstructor) =>
    // eslint-disable-next-line no-use-before-define
    new SocialLink(payload);
}

schema.loadClass(SchemaLoader);

const SocialLink = model<SocialLinkDocument, SocialLinkModel>(
  ModelName.SocialLink,
  schema,
  'social-links'
);

export { SocialLink };
