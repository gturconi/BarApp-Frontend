import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from "@angular/core";

@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.scss"],
})

export class PaginationComponent implements OnInit {
  @Input() currentPage: number = 0;
  @Input() totalPages: number = 0;
  @Input() limit: number = 1;
  @Output() changePage = new EventEmitter<number>();

  pages: number[] = [];

  constructor() {}

  ngOnInit() {
    this.pages = this.range(1, this.totalPages);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // This method will be called whenever any input property changes
    if (changes['totalPages']) {
      this.pages = this.range(1,changes['totalPages'].currentValue);
      // You can perform additional actions here based on the changes
    }
  }

  range(start: number, end: number): number[] {
    return [...Array(end).keys()].map(el => el + start);
  }
}
