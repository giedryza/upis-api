import { Types, Document } from 'mongoose';

type ID = Types.ObjectId;

export type Populated<M, K extends keyof M> = Omit<M, K> &
  {
    [P in K]: Exclude<M[P], ID[] | ID>;
  };

export type Selected<M, K extends keyof M> = Pick<M, K> & Document;

export interface WithTimestamp {
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentWithUser extends Document {
  user: ID;
}
