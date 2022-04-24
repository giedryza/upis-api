import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { PasswordService } from 'tools/services';
import { UnauthorizedError } from 'errors';
import { ModelName } from 'types/common';
import {
  UserDocument,
  UserModel,
  UserRecord,
  Role,
} from 'domain/users/users.types';

const schema = new Schema<UserDocument, UserModel, UserRecord>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.User,
    },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
    },
  }
);

schema.plugin(mongoosePaginate);

schema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hashed = await PasswordService.hash(this.get('password'));

    if (!hashed) throw new UnauthorizedError();

    this.set('password', hashed);
  }

  next();
});

const User = model<UserDocument, UserModel>(ModelName.User, schema);

export { User };
