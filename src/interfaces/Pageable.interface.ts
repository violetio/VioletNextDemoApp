import { PageSort } from './PageSort.interface';

export interface Pageable {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  sort: PageSort;
  unpaged: boolean;
}
