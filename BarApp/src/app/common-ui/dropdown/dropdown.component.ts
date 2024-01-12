import { Component, Input, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { isPlatform } from "@ionic/angular";

interface DropdownOption {
  label: string;
  value: any;
}

@Component({
  selector: "app-dropdown",
  templateUrl: "./dropdown.component.html",
  styleUrls: ["./dropdown.component.scss"],
})

export class DropdownComponent implements OnInit {
  @Input() control!: FormControl;
  @Input() label!: string;
  @Input() placeholder!: string;
  @Input() autocomplete!: string;
  @Input() options: DropdownOption[] = [];

  constructor() {}

  ngOnInit() {
  }
}
