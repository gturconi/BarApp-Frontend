import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export interface ValidationConfig {
  controlName: string;
  required?: boolean;
  email?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  IntegerPattern?: string;
  pattern?: string;
  customValidation?: (control: FormGroup) => ValidationErrors | null;
}
