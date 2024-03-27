export class EntityListResponse<T> {
  constructor(
    count: number,
    results: T[],
    currentPage: number,
    totalPages: number
  ) {
    this.count = count;
    this.results = results;
    this.currentPage = currentPage;
    this.totalPages = totalPages;
  }
  count!: number;
  results!: T[];
  currentPage!: number;
  totalPages!: number;
}
