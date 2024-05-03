interface InputField {
  type: 'input';
  name: string;
  label: string;
  inputType: 'text' | 'number' | 'file' | 'date' | 'time'; // Tipos de entrada permitidos
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

interface TextAreaField {
  type: 'textarea';
  name: string;
  label: string;
  inputType: 'textarea';
  icon?: string;
  iconName?: string;
}

export type FormField = InputField | CheckboxField | TextAreaField;

export interface Button {
  label: string;
  type: string;
  routerLink: string;
  icon: string;
}
