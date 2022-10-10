import { Schema, model } from 'mongoose';

import { ModelName } from 'types/common';

import { ImageDocument, ImageModel } from './images.types';

const schema = new Schema<ImageDocument>(
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
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      virtuals: true,
    },
  }
);

export const Image = model<ImageDocument, ImageModel>(ModelName.Image, schema);
