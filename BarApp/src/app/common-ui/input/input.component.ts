import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  @Input() control!: FormControl;
  @Input() type!: string;
  @Input() label!: string;
  @Input() autocomplete!: string;
  @Input() icon!: string;
  @Input() iconName!: string;

  isPasswords!: boolean;
  hide: boolean = true;
  imageUploaded = false;
  siteKey = environment.siteKey;

  constructor() {}

  minDate: string = new Date().toISOString().split('T')[0];

  ngOnInit() {
    if (this.type == 'password') this.isPasswords = true;

    if (this.type === 'checkbox') {
      if (this.label === 'Baja') {
        this.control.setValue(false);
      } else {
        this.control.setValue(true);
      }
    }
    if (this.type === 'date') {
    }
  }

  showOrHidePassword() {
    this.hide = !this.hide;

    if (this.hide) this.type = 'password';
    else this.type = 'text';
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.imageUploaded = true;
    this.control.setValue(file);
  }
}
