import { Request } from 'express';
import { Basics } from 'utils/basics';

export class ListAggregation {
  private reservedParams = ['sort', 'page', 'limit'];

  private defaults = {
    sort: { createdAt: -1 },
    limit: 30,
    page: 1,
  };

  private get paginationParams() {
    const page = Basics.toPositive(this.query.page, this.defaults.page);
    const limit = Basics.toPositive(this.query.limit, this.defaults.limit);
    const skip = (page - 1) * limit;

    return { page, limit, skip };
  }

  constructor(private query: Request['query']) {}

  get filter() {
    const filters = Basics.filterObject(this.query, this.reservedParams);

    return { $match: filters };
  }

  get sort() {
    const { sort } = this.query;

    const filter = Basics.isObject(sort)
      ? Object.entries(sort).reduce(
          (acc, [key, value]) =>
            ['-1', '1'].includes(value) ? { ...acc, [key]: +value } : acc,
          {}
        )
      : this.defaults.sort;

    return { $sort: filter };
  }

  get paginate() {
    const { page, limit, skip } = this.paginationParams;

    return {
      $facet: {
        meta: [{ $count: 'total' }, { $addFields: { page, limit } }],
        data: [{ $skip: skip }, { $limit: limit }],
      },
    };
  }

  get serialize() {
    const { page, limit } = this.paginationParams;

    return {
      $project: {
        meta: {
          $cond: {
            if: { $gt: [{ $size: '$meta' }, 0] },
            then: { $arrayElemAt: ['$meta', 0] },
            else: {
              total: { $size: '$data' },
              page,
              limit,
            },
          },
        },
        data: 1,
      },
    };
  }
}
