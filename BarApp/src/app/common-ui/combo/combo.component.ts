import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

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

  constructor() {}

  ngOnInit() {}

  getSelectedValue(defaultValue: string | undefined): string | undefined {
    if (defaultValue) {
      const selectedItem = this.comboItems.find(
        item => item.description === defaultValue
      );
      return selectedItem ? selectedItem.id : undefined;
    }
    return undefined;
  }
}
