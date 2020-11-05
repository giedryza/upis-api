import { Document, PaginateModel } from 'mongoose';
import { WithTimestamp } from 'types/mongoose';

export enum Role {
  User = 'user',
  Manager = 'manager',
  Admin = 'admin',
}

export interface User {
  id: string;
  email: string;
  role: Role;
}

export interface UserConstructor {
  email: string;
  password: string;
}

export interface UserRecord extends WithTimestamp {
  email: string;
  password: string;
  role: Role;
}

export interface UserDocument extends UserRecord, Document {}

export interface UserModel extends PaginateModel<UserDocument> {
  construct(payload: UserConstructor): UserDocument;
}

export declare namespace Body {
  interface signup {
    email: string;
    password: string;
    confirmPassword: string;
  }
  interface signin {
    email: string;
    password: string;
  }
}

export declare namespace Payload {
  interface signup {
    email: string;
    password: string;
  }
  interface signin {
    email: string;
    password: string;
  }
}
