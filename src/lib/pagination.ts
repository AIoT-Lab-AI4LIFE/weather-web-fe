export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function paginationAdapter(params: PaginationParams & object | undefined) {
  if (!params) {
    return params;
  }
  return {
    ...params,
    skip: params.page ? (params.page - 1) * (params.limit || 10) : undefined,
    limit: params.limit,
    search: params.search,
  };
}
