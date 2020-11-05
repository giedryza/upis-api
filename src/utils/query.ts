import { Request } from 'express';
import { Basics } from 'utils/basics';

export class Query {
  private reservedParams = ['sort', 'select', 'page', 'limit'];

  private defaults = {
    sort: { createdAt: -1 },
    limit: 30,
    page: 1,
  };

  constructor(private query: Request['query']) {}

  get page() {
    return Basics.toPositive(this.query.page, this.defaults.page);
  }

  get limit() {
    return Basics.toPositive(this.query.limit, this.defaults.limit);
  }

  get filter() {
    return Basics.filterObject(this.query, this.reservedParams);
  }

  get select() {
    const { select } = this.query;

    return Array.isArray(select) ? select : [];
  }

  get sort() {
    const { sort } = this.query;

    return Basics.isObject(sort)
      ? Object.entries(sort).reduce(
          (acc, [key, value]) =>
            ['-1', '1'].includes(value) ? { ...acc, [key]: +value } : acc,
          {}
        )
      : this.defaults.sort;
  }
}
