import { Request } from 'express';
import { Basics } from 'utils/basics';

export class QueryAggregation {
  private reservedParams = ['sort', 'page', 'limit'];

  private defaults = {
    sort: { createdAt: -1 },
    limit: 30,
    page: 1,
  };

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
    const page = Basics.toPositive(this.query.page, this.defaults.page);
    const limit = Basics.toPositive(this.query.limit, this.defaults.limit);
    const skip = (page - 1) * limit;

    return {
      $facet: {
        meta: [{ $count: 'total' }, { $addFields: { page, limit } }],
        data: [{ $skip: skip }, { $limit: limit }],
      },
    };
  }
}
