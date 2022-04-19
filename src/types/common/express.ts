import { Request } from 'express';

export interface AppRequest<Query extends Request['query'] = {}, Body = {}>
  extends Request {
  body: Body;
  query: Query;
}
