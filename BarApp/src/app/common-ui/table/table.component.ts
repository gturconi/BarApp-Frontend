import { Component, Input, OnInit } from "@angular/core";

export type TableData = Record<string, string | number>;

export interface TableColumn {
  label: string;
  key: string;
  action?: (data: any) => void;
  hideLabel?: (data: any) => boolean;
};

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"],
})


export class TableComponent implements OnInit {
  @Input() columns!: TableColumn[];
  @Input() data!: TableData[];

  constructor() {}

  columnIsAction(column: TableColumn) {
    return typeof column.action === 'function';
  }

  shouldHideLabel(comparisonFn?: (data: TableData) => void, data?: TableData) {
    if(!!comparisonFn && data && typeof comparisonFn === 'function') {
      return comparisonFn(data);
    }
    return false;
  }

  ngOnInit() {
    console.log(this.columns, this.data);
  }
}
