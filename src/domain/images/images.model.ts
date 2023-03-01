import { Schema, model, Query } from 'mongoose';

import { Tour } from 'domain/tours/tours.model';
import { SCORE_RATES } from 'domain/tours/tours.constants';
import { ModelName } from 'types/common';
import { filesService } from 'tools/services';

import { ImageDocument, ImageRecord } from './images.types';

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
    },
  }
);

schema.post<Query<ImageDocument | null, ImageDocument>>(
  'findOneAndDelete',
  async (doc, next) => {
    if (!doc) return next();

    await Promise.all([
      Tour.updateMany(
        { photos: doc._id },
        { $pull: { photos: doc._id }, $inc: { score: -SCORE_RATES.photos } }
      ),
      filesService('cloudinary').delete([doc.key]),
    ]);

    next();
  }
);

export const Image = model<ImageRecord>(ModelName.Image, schema);
