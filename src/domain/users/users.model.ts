import mongoose from 'mongoose';
import { Password } from 'utils/password';
import { UnauthorizedError } from 'errors/unauthorized.error';
import { Payload, Document, Model, Role } from 'domain/users/users.types';

const schema = new mongoose.Schema(
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
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: {
      versionKey: false,
    },
  }
);

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
schema.statics.construct = (payload: Payload) => new User(payload);

const User = mongoose.model<Document, Model>('User', schema);

export { User };
