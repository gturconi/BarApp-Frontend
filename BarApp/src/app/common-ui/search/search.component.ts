import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class AppSearchComponent {
  searchText: string = '';
  @Input() id: string = '';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Output() searchChanged = new EventEmitter<string>();

  onSearchChange() {
    this.searchChanged.emit(this.searchText);
  }
}
