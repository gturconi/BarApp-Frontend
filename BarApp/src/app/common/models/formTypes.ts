interface InputField {
  type: 'input';
  name: string;
  label: string;
  inputType: 'text' | 'number' | 'file' | 'date'; // Tipos de entrada permitidos
  icon?: string;
  iconName?: string;
}

interface CheckboxField {
  type: 'checkbox';
  name: string;
  label: string;
  inputType: 'checkbox';
  icon?: string;
  iconName?: string;
}

export type FormField = InputField | CheckboxField;

export interface Button {
  label: string;
  type: string;
  routerLink: string;
  icon: string;
}
