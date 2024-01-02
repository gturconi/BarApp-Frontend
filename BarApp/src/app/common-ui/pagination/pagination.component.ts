import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.scss"],
})
export class PaginationComponent implements OnInit {
  @Input() currentPage: number = 0;
  @Input() totalPages: number = 0;
  @Input() limit: number = 0;
  @Output() changePage = new EventEmitter<number>();

  pages: number[] = [];

  constructor() {}

  ngOnInit() {
    const pagesCount = Math.ceil(this.totalPages / this.limit);
    this.pages = this.range(1, pagesCount);
    console.log(this.pages);
  }

  range(start: number, end: number): number[] {
    return [...Array(end).keys()].map(el => el + start);
  }
}
