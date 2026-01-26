export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  lastPage?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
