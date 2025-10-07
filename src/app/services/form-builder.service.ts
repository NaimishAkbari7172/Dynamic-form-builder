import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormField, FormFieldType } from '../models/form-field.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class FormBuilderService {
  /**
   * BehaviorSubject to manage the form fields state
   */
  private formFieldsSubject = new BehaviorSubject<FormField[]>([]);
  
  /**
   * Observable that components can subscribe to
   */
  public formFields$ = this.formFieldsSubject.asObservable();

  constructor() { }

  /**
   * Returns the current array of form fields
   */
  private getFormFields(): FormField[] {
    return this.formFieldsSubject.getValue();
  }

  /**
   * Updates the form fields BehaviorSubject with a new array
   */
  private setFormFields(fields: FormField[]): void {
    this.formFieldsSubject.next(fields);
  }

  /**
   * Adds a new form field to the canvas
   */
  addFormField(field: FormField, index?: number): void {
    const fields = this.getFormFields();
    
    // Create a copy of the field with a unique ID
    const newField: FormField = {
      ...field,
      id: uuidv4() // Generate a unique ID for the new field
    };
    
    if (index !== undefined) {
      // Insert at specific position
      const updatedFields = [...fields];
      updatedFields.splice(index, 0, newField);
      this.setFormFields(updatedFields);
    } else {
      // Add to the end
      this.setFormFields([...fields, newField]);
    }
  }

  /**
   * Updates an existing form field
   */
  updateFormField(field: FormField): void {
    const fields = this.getFormFields();
    const index = fields.findIndex(f => f.id === field.id);
    
    if (index !== -1) {
      // Create a deep copy of the field with special handling for the options array
      const updatedField: FormField = {
        ...field,
        // Make sure to create a new array for options if it exists
        options: field.options ? [...field.options] : undefined
      };
      
      const updatedFields = [...fields];
      updatedFields[index] = updatedField;
      this.setFormFields(updatedFields);
    }
  }

  /**
   * Removes a form field from the canvas
   */
  removeFormField(fieldId: string): void {
    const fields = this.getFormFields();
    const updatedFields = fields.filter(field => field.id !== fieldId);
    this.setFormFields(updatedFields);
  }

  /**
   * Reorders a form field within the canvas
   */
  reorderFormField(previousIndex: number, currentIndex: number): void {
    const fields = this.getFormFields();
    
    if (previousIndex === currentIndex) {
      return;
    }
    
    const updatedFields = [...fields];
    const [movedItem] = updatedFields.splice(previousIndex, 1);
    updatedFields.splice(currentIndex, 0, movedItem);
    
    this.setFormFields(updatedFields);
  }

  /**
   * Imports a form configuration from a previously exported JSON
   */
  importFormConfig(config: any): void {
    if (config && config.fields && Array.isArray(config.fields)) {
      // Clear existing fields
      this.setFormFields([]);
      
      // Import each field
      config.fields.forEach((field: any) => {
        if (field.id && field.type) {
          // Create a proper FormField object
          const importedField: FormField = {
            id: field.id,
            type: field.type as FormFieldType,
            label: field.label || 'Untitled Field',
            required: field.required || false,
            description: field.description,
            placeholder: field.placeholder,
            options: field.options,
            multiple: field.multiple,
            acceptedFileTypes: field.acceptedFileTypes
          };
          
          // Add the field to the form
          this.addFormField(importedField);
        }
      });
    }
  }
  
  /**
   * Returns the current form configuration as an object for export
   */
  getFormConfig(): any {
    const fields = this.getFormFields();
    return {
      formName: 'Dynamic Form',
      createdAt: new Date().toISOString(),
      fields: fields.map(field => {
        // Create a base field with common properties
        const exportedField: any = {
          id: field.id,
          type: field.type,
          label: field.label,
          required: field.required,
          description: field.description
        };
        
        // Add placeholder if present
        if (field.placeholder) {
          exportedField.placeholder = field.placeholder;
        }
        
        // Add options if present
        if (field.options && field.options.length > 0) {
          exportedField.options = [...field.options];
        }
        
        // Add file upload specific properties
        if (field.type === 'file') {
          if (field.multiple !== undefined) {
            exportedField.multiple = field.multiple;
          }
          if (field.acceptedFileTypes) {
            exportedField.acceptedFileTypes = field.acceptedFileTypes;
          }
        }
        
        return exportedField;
      })
    };
  }
}
