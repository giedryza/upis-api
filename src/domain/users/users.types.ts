import { Document, PaginateModel } from 'mongoose';

import { WithTimestamp } from 'types/common';

export enum Role {
  User = 'user',
  Manager = 'manager',
  Admin = 'admin',
}

export interface User {
  _id: string;
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

export interface Body {
  signup: {
    email: string;
    password: string;
    confirmPassword: string;
  };
  signin: {
    email: string;
    password: string;
  };
  updatePassword: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  forgotPassword: {
    email: string;
  };
  resetPassword: {
    userId: string;
    token: string;
    password: string;
  };
}

export interface Payload {
  signup: {
    email: string;
    password: string;
  };
  signin: {
    email: string;
    password: string;
  };
  me: {
    user?: User;
  };
  updatePassword: {
    userId: string;
    currentPassword: string;
    newPassword: string;
  };
  forgotPassword: {
    email: string;
  };
  resetPassword: {
    userId: string;
    token: string;
    password: string;
  };
}
