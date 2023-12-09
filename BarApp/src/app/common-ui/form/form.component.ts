import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

export interface ValidationConfig {
  controlName: string;
  required?: boolean;
  email?: boolean;
  minLength?: number;
}

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
})
export class FormComponent implements OnInit {
  @Input() form!: FormGroup<any>;
  @Input() fields: any[] = [];
  @Input() buttons!: any[];
  @Input() validationConfig!: ValidationConfig[];

  @Output() formSubmit = new EventEmitter<FormGroup>();

  constructor() {}

  ngOnInit() {
    const formControls: { [key: string]: FormControl } = {};
    this.validationConfig.forEach(config => {
      const validators = [];
      if (config.required) {
        validators.push(Validators.required);
      }
      if (config.email) {
        validators.push(Validators.email);
      }
      if (config.minLength) {
        validators.push(Validators.minLength(config.minLength));
      }
      formControls[config.controlName] = new FormControl("", validators);
    });

    this.form = new FormGroup(formControls);
  }

  getFormControl(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }

  // En tu componente
  getErrorMessage(controlName: string): string | null {
    const control = this.form.get(controlName);

    if (control?.errors && control.touched) {
      if (control.errors["required"]) {
        return "Este campo es requerido";
      } else if (control.errors["email"]) {
        return "Ingrese un correo válido";
      } else if (control.errors["minlength"]) {
        return (
          "El campo debe tener al menos " +
          control.errors["minlength"].requiredLength +
          " caracteres"
        );
      }
      return "Error en el campo " + controlName;
    }
    return null;
  }

  submit(): void {
    this.formSubmit.emit(this.form);
  }
}
