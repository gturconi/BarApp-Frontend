import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-combo',
  templateUrl: './combo.component.html',
  styleUrls: ['./combo.component.scss'],
})
export class ComboComponent implements OnInit {
  @Input() form: FormGroup = new FormGroup({});
  @Input() title: string = '';
  @Input() comboItems: string[] = [];
  @Input() defaultValue?: string;

  constructor() {}

  ngOnInit() {}
}
