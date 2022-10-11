import { Schema, model } from 'mongoose';

import { ModelName } from 'types/common';

import { ImageRecord } from './images.types';

const schema = new Schema<ImageRecord>(
  {
    url: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
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

export const Image = model<ImageRecord>(ModelName.Image, schema);
