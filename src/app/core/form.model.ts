export enum FieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  DATE = 'date',
  RADIO = 'radio',
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  helpText?: string;
  placeholder?: string;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export interface FormTemplate {
  id: string;
  title: string;
  fields: FormField[];
  created: Date;
}

export type UserRole = 'admin' | 'user';
