import { Schema, model } from 'mongoose';

import { ModelName } from 'types/common';

import { TokenRecord, TokenDocument, TokenModel } from './token.types';

const schema = new Schema<TokenDocument, TokenModel, TokenRecord>({
  token: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: ModelName.User,
    required: true,
  },
  expireAt: {
    type: Date,
    default: new Date(
      Date.now() + 1000 * 60 * 60 * +process.env.TOKEN_EXPIRES_IN_HOURS
    ),
  },
});

export const Token = model<TokenDocument, TokenModel>(ModelName.Token, schema);
