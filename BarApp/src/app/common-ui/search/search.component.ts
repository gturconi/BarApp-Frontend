import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable, Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {
  searchSubject: Subject<string> = new Subject<string>();

  searchText: string = '';
  @Input() id: string = '';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Output() searchChanged = new EventEmitter<string>();

  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(1000))
      .subscribe((searchText: string) => {
        this.searchChanged.emit(searchText);
      });
  }
  onSearchChange() {
    this.searchSubject.next(this.searchText);
  }
}
