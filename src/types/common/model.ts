import { Types, Document } from 'mongoose';

export type EntityId = Types.ObjectId;

export type Populated<M, K extends keyof M> = Omit<M, K> & {
  [P in K]: Exclude<M[P], EntityId[] | EntityId>;
};

export type Selected<M, K extends keyof M> = Pick<M, K> & Document;

export interface WithTimestamp {
  createdAt: Date;
  updatedAt: Date;
}

export enum ModelName {
  Company = 'Company',
  SocialLink = 'SocialLink',
  Token = 'Token',
  Tour = 'Tour',
  User = 'User',
}
