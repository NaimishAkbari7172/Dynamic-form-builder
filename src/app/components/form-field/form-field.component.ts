import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormField, FormFieldType } from '../../models/form-field.model';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  standalone: false
})
export class FormFieldComponent implements OnInit {
  @Input() field!: FormField;
  @Input() showActions: boolean = false;
  
  @Output() editField = new EventEmitter<void>();
  @Output() removeField = new EventEmitter<void>();
  
  form: FormGroup;
  fieldType = FormFieldType;

  constructor(private fb: FormBuilder) {
    // Initialize with empty form group
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    this.createFormControl();
  }

  /**
   * Creates a reactive form control based on the field type
   */
  createFormControl(): void {
    if (!this.field || !this.field.id) {
      console.error('Form field is missing or has no ID', this.field);
      return;
    }
    
    // Create a new form group
    this.form = new FormGroup({});
    
    // Different control setup based on field type
    switch (this.field.type) {
      case FormFieldType.TEXT:
      case FormFieldType.TEXTAREA:
        if (this.field.required) {
          this.form.addControl(
            this.field.id, 
            new FormControl('', [Validators.required])
          );
        } else {
          this.form.addControl(
            this.field.id, 
            new FormControl('')
          );
        }
        break;
        
      case FormFieldType.CHECKBOX_GROUP:
        // For checkbox groups, we need to create a form control for each option
        if (this.field.options && this.field.options.length > 0) {
          this.field.options.forEach((option, index) => {
            this.form.addControl(
              `${this.field.id}_${index}`,
              new FormControl(false)
            );
          });
        }
        break;
        
      case FormFieldType.RADIO:
      case FormFieldType.DROPDOWN:
      default:
        if (this.field.required) {
          this.form.addControl(
            this.field.id, 
            new FormControl('', [Validators.required])
          );
        } else {
          this.form.addControl(
            this.field.id, 
            new FormControl('')
          );
        }
        break;
    }
  }
}
