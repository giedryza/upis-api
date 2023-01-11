export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginatedList<Item = any> {
  data: Item[];
  meta: Pagination;
}
