import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ValidationConfig } from "@common/models/validationConfig";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
})
export class FormComponent implements OnInit {
  @Input() form!: FormGroup<any>;
  @Input() fields: any[] = [];
  @Input() buttons!: any[];
  @Input() validationConfig!: ValidationConfig[];
  @Input() editMode: boolean = false;

  @Output() formSubmit = new EventEmitter<FormGroup>();
  @Output() formEdit = new EventEmitter<FormGroup>();

  customValidator = false;
  validator!: any;

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

      if (config.customValidation) {
        this.customValidator = true;
        this.validator = config.customValidation;
      }

      formControls[config.controlName] = new FormControl("", validators);
    });
    this.form = new FormGroup(formControls);
    if (this.customValidator) {
      this.form = new FormGroup(formControls, this.validator);
    } else {
      this.form = new FormGroup(formControls);
    }

    this.formEdit.emit(this.form);
  }

  getFormControl(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }

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
      } else if (control.errors["notSame"]) {
        return "Las contraseñas no coinciden";
      }
      return "Error en el campo " + controlName;
    }
    return null;
  }

  submit(): void {
    this.formSubmit.emit(this.form);
  }
}
