import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { Password } from 'utils/password';
import { UnauthorizedError } from 'errors/unauthorized.error';
import {
  UserConstructor,
  UserDocument,
  UserModel,
  Role,
} from 'domain/users/users.types';

const schema = new Schema(
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
    try {
      const hashed = await Password.hash(this.get('password'));
      this.set('password', hashed);
    } catch (err) {
      throw new UnauthorizedError();
    }
  }

  next();
});

// eslint-disable-next-line no-use-before-define
schema.statics.construct = (payload: UserConstructor) => new User(payload);

const User = model<UserDocument, UserModel>('User', schema);

export { User };
