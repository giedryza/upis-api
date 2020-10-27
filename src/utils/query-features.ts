import { Document, DocumentQuery, FilterQuery } from 'mongoose';
import { Basics } from 'utils/basics';

export class QueryFeatures<T extends Document> {
  private reservedParams = ['sort', 'select', 'page', 'limit'];

  private defaultSort = { createdAt: 'desc' };

  private defaultLimit = 30;

  constructor(
    public documentQuery: DocumentQuery<T[], T>,
    private filterQuery: FilterQuery<T>
  ) {}

  filter = () => {
    const filter = Basics.filterObject<FilterQuery<T>>(
      this.filterQuery,
      this.reservedParams
    );

    this.documentQuery = this.documentQuery.find(filter);

    return this;
  };

  sort = () => {
    const filter = this.filterQuery.sort || this.defaultSort;

    this.documentQuery = this.documentQuery.sort(filter);

    return this;
  };

  select = () => {
    const filter = this.filterQuery.select;

    this.documentQuery = this.documentQuery.select(filter);

    return this;
  };

  paginate = () => {
    const page = +this.filterQuery.page || 1;
    const limit = +this.filterQuery.limit || this.defaultLimit;
    const skip = (page - 1) * limit;

    this.documentQuery = this.documentQuery.skip(skip).limit(limit);

    return this;
  };
}
