import { Component, Input, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-input",
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.scss"],
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

  constructor() {}

  ngOnInit() {
    if (this.type == "password") this.isPasswords = true;
  }

  showOrHidePassword() {
    this.hide = !this.hide;

    if (this.hide) this.type = "password";
    else this.type = "text";
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.control.setValue(file);
  }
}
