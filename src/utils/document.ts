import { Document as MongooseDocument } from 'mongoose';
import { Helpers } from 'utils/helpers';

export class Document {
  static update = async <T extends MongooseDocument>(
    document: T,
    update: Partial<T>
  ) => {
    document.set(Helpers.stripUndefined(update));

    await document.save();

    return document;
  };
}
