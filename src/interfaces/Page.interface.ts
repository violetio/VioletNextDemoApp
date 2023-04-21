import { PageSort } from './PageSort.interface';
import { Pageable } from './Pageable.interface';

export interface Page<T> {
  content: Array<T>;
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: Pageable;
  size: number;
  sort: PageSort;
  totalElements: number;
  totalPages: number;
}
