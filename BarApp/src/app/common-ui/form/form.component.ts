import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Dropdown } from '@common/models/dropdown';
import { EntityListResponse } from '@common/models/entity.list.response';
import { ValidationConfig } from '@common/models/validationConfig';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent implements OnInit {
  @Input() form!: FormGroup<any>;
  @Input() fields: any[] = [];
  @Input() buttons!: any[];
  @Input() validationConfig!: ValidationConfig[];
  @Input() editMode: boolean = false;

  @Input() combos?: Dropdown[];

  combosFields: { id: string; description: string }[][] = [];
  defaultValues: string[] = [];

  @Output() formSubmit = new EventEmitter<FormGroup>();
  @Output() formEdit = new EventEmitter<FormGroup>();

  customValidator = false;
  validator!: any;

  constructor() {}

  ngOnInit() {
    if (this.combos) {
      this.setCombos();
    }
    this.SetvalidationConfig();

    this.formEdit.emit(this.form);
  }

  getFormControl(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }

  getErrorMessage(controlName: string): string | null {
    const control = this.form.get(controlName);

    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return 'Este campo es requerido';
      } else if (control.errors['email']) {
        return 'Ingrese un correo válido';
      } else if (control.errors['minlength']) {
        return (
          'El campo debe tener al menos ' +
          control.errors['minlength'].requiredLength +
          ' caracteres'
        );
      } else if (control.errors['notSame']) {
        return 'Las contraseñas no coinciden';
      } else if (control.errors['min']) {
        return 'El valor debe ser mayor o igual a ' + control.errors['min'].min;
      } else if (control.errors['max']) {
        return 'El valor debe ser menor o igual a ' + control.errors['max'].max;
      } else if (control.errors['Datevalid']) {
        return 'Debes proporcionar ambas fechas o ninguna';
      } else if (control.errors['DateInvalidRange']) {
        return 'La fecha desde debe ser menor a la fecha hasta';
      }
      return 'Error en el campo ' + controlName;
    }
    return null;
  }

  submit(): void {
    this.formSubmit.emit(this.form);
  }

  SetvalidationConfig() {
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

      if (config.min != undefined) {
        validators.push(Validators.min(config.min));
      }

      if (config.max != undefined) {
        validators.push(Validators.max(config.max));
      }

      if (config.customValidation) {
        this.customValidator = true;
        this.validator = config.customValidation;
      }

      formControls[config.controlName] = new FormControl('', validators);
    });
    this.form = new FormGroup(formControls);
    if (this.customValidator) {
      this.form = new FormGroup(formControls, this.validator);
    } else {
      this.form = new FormGroup(formControls);
    }
  }
  setCombos() {
    this.combos?.forEach((combo, index) => {
      combo.fields.subscribe(field => {
        this.combosFields.push([]);
        combo.defaultValue?.subscribe(defaultValue => {
          this.defaultValues[index] = defaultValue;
        });
        field.results.map(result => {
          const option = {
            id: result.id,
            description: result.description,
          };
          this.combosFields[index].push(option);
        });
      });
    });
  }
}
