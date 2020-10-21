import mongoose from 'mongoose';
import { Timestamp } from 'types/document';
import { Document as UserDocument } from 'domain/users/users.types';

export enum SocialType {
  Facebook = 'facebook',
  Instagram = 'instagram',
  Youtube = 'youtube',
  Linkedin = 'linkedin',
  Twitter = 'twitter',
}

interface Social {
  type: SocialType;
  link: string;
}

export interface ConstructorPayload {
  user: string;
  name: string;
  phone: string;
  email: string;
  description?: string;
}

export interface Document extends mongoose.Document, Timestamp {
  name: string;
  phone: string;
  email: string;
  description?: string;
  website?: string;
  social?: Social[];
  address?: string;
  user: mongoose.Types.ObjectId | UserDocument;
  location?: {
    coordinates: number[];
  };
}

export interface Model extends mongoose.Model<Document> {
  construct(payload: ConstructorPayload): Document;
}

export declare namespace Body {
  interface create {
    name: string;
    phone: string;
    email: string;
    description?: string;
  }
}

export declare namespace Payload {
  interface getOne {
    id: string;
  }

  interface create {
    user: string;
    name: string;
    phone: string;
    email: string;
    description?: string;
  }

  interface update {
    id: string;
    userId: string;
    name?: string;
    phone?: string;
    email?: string;
    description?: string;
    address?: string;
    website?: string;
    social?: Social[];
    location?: {
      coordinates: number[];
    };
  }

  interface destroy {
    id: string;
    userId: string;
  }
}
