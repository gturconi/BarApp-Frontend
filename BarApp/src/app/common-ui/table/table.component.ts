import { Component, Input, OnInit } from '@angular/core';
export type TableData = Record<string, string | number>;

export interface TableColumn {
  label: string;
  key: string;
  action?: (data: any) => void;
  hideAction?: (data: any) => boolean;
  formatter?: (data: any) => any;
  actionClass?: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
})
export class TableComponent implements OnInit {
  @Input({ required: true }) columns!: TableColumn[];
  @Input({ required: true }) data!: TableData[];
  @Input() loading: boolean = false;

  actionsColumns: TableColumn[] = [];
  constructor() {}

  ngOnInit() {
    this.actionsColumns = this.getColumsActions();
  }

  getButtonColumnClass(column: TableColumn) {
    const defaultClass = 'buttonTable';
    if (!!column?.actionClass) {
      return `${defaultClass} ${column.actionClass}`;
    }
    return defaultClass;
  }

  columnIsAction(column: TableColumn) {
    return typeof column.action === 'function';
  }

  getColumsActions() {
    return this.columns.filter(column => this.columnIsAction(column));
  }

  shouldHideAction(data: TableData, comparisonFn?: (data: TableData) => void) {
    if (!!comparisonFn && typeof comparisonFn === 'function') {
      return comparisonFn(data);
    }
    return false;
  }

  formatData(
    key: string,
    data: TableData,
    formatter?: (data: TableData) => void
  ) {
    if (!!formatter && typeof formatter === 'function') {
      return formatter(data);
    }
    return data?.[key] || '';
  }
}
