declare module 'mongoose' {
  import {
    CollationOptions,
    Model,
    Schema,
    FilterQuery,
    QueryFindOptions,
  } from 'mongoose';

  interface CustomLabels {
    totalDocs?: string;
    limit?: string;
    page?: string;
    totalPages?: string;
    docs?: string;
    nextPage?: string;
    prevPage?: string;
  }

  interface ReadOptions {
    pref: string;
    tags?: any[];
  }

  interface QueryPopulateOptions {
    /** space delimited path(s) to populate */
    path: string;
    /** optional fields to select */
    select?: any;
    /** optional query conditions to match */
    match?: any;
    /** optional model to use for population */
    model?: string | Model<any>;
    /** optional query options like sort, limit, etc */
    options?: any;
    /** deep populate */
    populate?: QueryPopulateOptions | QueryPopulateOptions[];
  }

  interface PaginateOptions {
    select?: Object | string;
    sort?: Object | string;
    customLabels?: CustomLabels;
    collation?: CollationOptions;
    populate?: Object[] | string[] | Object | string | QueryPopulateOptions;
    lean?: boolean;
    leanWithId?: boolean;
    offset?: number;
    page?: number;
    limit?: number;
    read?: ReadOptions;
    /* If pagination is set to `false`, it will return all docs without adding limit condition. (Default: `true`) */
    pagination?: boolean;
    projection?: any;
    options?: QueryFindOptions;
  }

  interface PaginateResult<T> {
    docs: T[];
    totalDocs: number;
    limit: number;
    page?: number;
    totalPages: number;
    nextPage?: number | null;
    prevPage?: number | null;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    meta?: any;
    [customLabel: string]: T[] | number | boolean | null | undefined;
  }

  interface PaginateModel<T extends Document> extends Model<T> {
    paginate(
      query?: FilterQuery<T>,
      options?: PaginateOptions,
      callback?: (err: any, result: PaginateResult<T>) => void
    ): Promise<PaginateResult<T>>;
  }

  function model(
    name: string,
    schema?: Schema,
    collection?: string,
    skipInit?: boolean
  ): PaginateModel<any>;
}

declare module 'mongoose-paginate-v2' {
  import mongoose = require('mongoose');

  function _(schema: mongoose.Schema): void;
  export = _;
}
