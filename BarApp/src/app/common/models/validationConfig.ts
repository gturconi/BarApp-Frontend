import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms";

export interface ValidationConfig {
  controlName: string;
  required?: boolean;
  email?: boolean;
  minLength?: number;
  customValidation?: (control: FormGroup) => ValidationErrors | null;
}
