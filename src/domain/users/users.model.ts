import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { Password } from 'common/password';
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

class SchemaLoader {
  // eslint-disable-next-line no-use-before-define
  static construct = (payload: UserConstructor) => new User(payload);
}

schema.plugin(mongoosePaginate);
schema.loadClass(SchemaLoader);

schema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      const hashed = await Password.hash(this.get('password'));
      this.set('password', hashed);
    } catch (err: unknown) {
      throw new UnauthorizedError();
    }
  }

  next();
});

const User = model<UserDocument, UserModel>('User', schema);

export { User };
