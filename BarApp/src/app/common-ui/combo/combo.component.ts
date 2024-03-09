import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-combo',
  templateUrl: './combo.component.html',
  styleUrls: ['./combo.component.scss'],
})
export class ComboComponent implements OnInit {
  @Input() form: FormGroup = new FormGroup({});
  @Input() control!: FormControl;
  @Input() title: string = '';
  @Input() comboItems: { id: string; description: string }[] = [];
  @Input() defaultValue?: string;
  @Input() isMultiple: boolean = false;

  @Output() selectionChange = new Subject<string[]>();

  constructor() {}

  ngOnInit() {}

  getSelectedValue(): string | undefined {
    if (this.defaultValue) {
      const selectedItem = this.comboItems.find(
        item => item.description === this.defaultValue
      );
      return selectedItem ? selectedItem.id : undefined;
    }
    return undefined;
  }

  onSelectionChange() {
    this.selectionChange.next(this.control.value);
  }
}
