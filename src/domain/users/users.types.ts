import { Document, PaginateModel } from 'mongoose';

import { EntityId, WithTimestamp } from 'types/common';

export enum Role {
  User = 'user',
  Manager = 'manager',
  Admin = 'admin',
}

export interface AppUser {
  _id: EntityId;
  email: string;
  role: Role;
}

export interface UserRecord extends WithTimestamp {
  email: string;
  password: string;
  role: Role;
}

export interface UserDocument extends UserRecord, Document {}

export interface UserModel extends PaginateModel<UserDocument> {}
