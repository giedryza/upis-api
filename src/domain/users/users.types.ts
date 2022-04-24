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
  interface updatePassword {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
  interface forgotPassword {
    email: string;
  }
  interface resetPassword {
    userId: string;
    token: string;
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
  interface me {
    user?: User;
  }
  interface updatePassword {
    userId: string;
    currentPassword: string;
    newPassword: string;
  }
  interface forgotPassword {
    email: string;
  }
  interface resetPassword {
    userId: string;
    token: string;
    password: string;
  }
}
