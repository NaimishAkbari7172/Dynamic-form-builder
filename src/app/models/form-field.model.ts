export enum FormFieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  CHECKBOX_GROUP = 'checkbox_group',
  RADIO = 'radio',
  DROPDOWN = 'dropdown',
  FILE = 'file'
}

export interface FieldOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string | null;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  description?: string;
  required: boolean;
  options?: FieldOption[];
  multiple?: boolean;  // For file upload fields to allow multiple files
  acceptedFileTypes?: string; // Optional file types that can be uploaded
}
