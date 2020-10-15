import mongoose from 'mongoose';

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

export interface Payload {
  email: string;
  password: string;
}

export interface Document extends mongoose.Document {
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
}

export interface Model extends mongoose.Model<Document> {
  construct(payload: Payload): Document;
}
