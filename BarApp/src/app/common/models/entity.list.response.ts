export class EntityListResponse<T> {
  count!: number;
  results!: T[];
  currentPage!: number;
  totalPages!: number;
}
