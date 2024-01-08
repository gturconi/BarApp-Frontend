import { Component, Input, Output, EventEmitter } from '@angular/core';
//import { Subject } from 'rxjs';
//import { debounceTime, takeUntil } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
})

export class AppSearchComponent {
  searchText: string = '';
  @Input() id: string = '';
  @Output() searchChanged = new EventEmitter<string>();

  onSearchChange() {
    this.searchChanged.emit(this.searchText);
  }
}
