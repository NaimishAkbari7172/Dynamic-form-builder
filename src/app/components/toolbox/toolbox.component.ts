import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, copyArrayItem } from '@angular/cdk/drag-drop';
import { FormFieldType, FormField, FieldOption } from '../../models/form-field.model';
import { FormBuilderService } from '../../services/form-builder.service';

@Component({
  selector: 'app-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.scss'],
  standalone: false
})
export class ToolboxComponent implements OnInit {
  /**
   * List of available form field types to be used in the toolbox
   */
  formFieldTypes: FormField[] = [
    { 
      id: null, 
      type: FormFieldType.TEXT, 
      label: 'Text Input', 
      placeholder: 'Enter text', 
      description: 'Optional help text for this field',
      required: false 
    },
    { 
      id: null, 
      type: FormFieldType.TEXTAREA, 
      label: 'Textarea', 
      placeholder: 'Enter longer text', 
      description: 'Optional help text for this field',
      required: false 
    },
    { 
      id: null, 
      type: FormFieldType.CHECKBOX_GROUP, 
      label: 'Checkbox Group', 
      description: 'Optional help text for this field',
      required: false, 
      options: [
        { label: 'Display text 1', value: 'option1' },
        { label: 'Display text 2', value: 'option2' }
      ] 
    },
    { 
      id: null, 
      type: FormFieldType.RADIO, 
      label: 'Radio Button Group', 
      description: 'Optional help text for this field',
      required: false, 
      options: [
        { label: 'Display text 1', value: 'option1' },
        { label: 'Display text 2', value: 'option2' }
      ] 
    },
    { 
      id: null, 
      type: FormFieldType.DROPDOWN, 
      label: 'Dropdown', 
      description: 'Optional help text for this field',
      required: false, 
      options: [
        { label: 'Please select...', value: '' },
        { label: 'Display text 1', value: 'option1' },
        { label: 'Display text 2', value: 'option2' }
      ] 
    },
    { 
      id: null, 
      type: FormFieldType.FILE, 
      label: 'File Upload', 
      description: 'Upload files here',
      required: false,
      multiple: false,
      acceptedFileTypes: '.pdf,.jpg,.png,.doc,.docx'
    }
  ];

  constructor(private formBuilderService: FormBuilderService) { }

  ngOnInit(): void { }
  
  /**
   * Returns the appropriate icon class based on field type
   */
  getIconClass(fieldType: string): string {
    switch (fieldType) {
      case FormFieldType.TEXT:
        return 'fas fa-font';
      case FormFieldType.TEXTAREA:
        return 'fas fa-align-left';
      case FormFieldType.CHECKBOX_GROUP:
        return 'fas fa-tasks';
      case FormFieldType.RADIO:
        return 'fas fa-dot-circle';
      case FormFieldType.DROPDOWN:
        return 'fas fa-caret-down';
      case FormFieldType.FILE:
        return 'fas fa-file-upload';
      default:
        return 'fas fa-question';
    }
  }
  
  /**
   * Handle drag and drop between toolbox and canvas
   */
  onDrop(event: CdkDragDrop<FormField[]>): void {
    // Nothing to do on drop to toolbox as we don't modify the toolbox
    console.log('Item dropped on toolbox:', event);
  }
  
  /**
   * Creates a copy during drag to simulate creating a new field
   */
  noReturnPredicate() {
    return false;
  }
}
