import mongoose from 'mongoose';
import { Timestamp } from 'types/document';

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

export interface ConstructorPayload {
  email: string;
  password: string;
}

export interface Document extends mongoose.Document, Timestamp {
  email: string;
  password: string;
  role: Role;
}

export interface Model extends mongoose.Model<Document> {
  construct(payload: ConstructorPayload): Document;
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
