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
  User = 'User',
  Token = 'Token',
  Image = 'Image',
  Provider = 'Provider',
  SocialLink = 'SocialLink',
  Amenity = 'Amenity',
  Tour = 'Tour',
}
