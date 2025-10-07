import { Component, OnInit } from "@angular/core";
import {
  CdkDragDrop,
  copyArrayItem,
  transferArrayItem,
  moveItemInArray,
} from "@angular/cdk/drag-drop";
import { FormBuilderService } from "../../services/form-builder.service";
import {
  FormField,
  FieldOption,
  FormFieldType,
} from "../../models/form-field.model";

@Component({
  selector: "app-canvas",
  templateUrl: "./canvas.component.html",
  styleUrls: ["./canvas.component.scss"],
  standalone: false,
})
export class CanvasComponent implements OnInit {
  /**
   * Form fields currently on the canvas
   */
  formFields: FormField[] = [];

  /**
   * Currently selected form field for editing
   */
  selectedField: FormField | null = null;

  constructor(private formBuilderService: FormBuilderService) {}

  ngOnInit(): void {
    // Subscribe to the form fields from the service
    this.formBuilderService.formFields$.subscribe((fields) => {
      this.formFields = fields;
    });
  }

  /**
   * Handles drop events when a form element is dragged from the toolbox to the canvas
   */
  onDrop(event: CdkDragDrop<FormField[]>): void {
    console.log("Drop event:", event);

    // Check if the item is being dropped in the same container
    if (event.previousContainer === event.container) {
      console.log("Reordering within canvas");
      // Reordering within the canvas
      this.formBuilderService.reorderFormField(
        event.previousIndex,
        event.currentIndex
      );
    } else {
      console.log("Adding from toolbox to canvas");
      // Adding from toolbox to canvas
      const fieldType = event.item.data;
      console.log("Field type being added:", fieldType);

      // Add the form field to the current position in the canvas
      if (fieldType) {
        this.formBuilderService.addFormField(
          { ...fieldType },
          event.currentIndex
        );
      }
    }
  }

  /**
   * Selects a form field for editing
   */
  selectField(field: FormField, index?: number): void {
    console.log("Selected field:", field);
    this.selectedField = field;

    // Scroll to the field if needed
    setTimeout(() => {
      const elementId = `field-${field.id}`;
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  }

  /**
   * Removes a field from the canvas
   */
  removeField(fieldId: string | null): void {
    if (fieldId) {
      console.log("Removing field with id:", fieldId);
      this.formBuilderService.removeFormField(fieldId);
      if (this.selectedField && this.selectedField.id === fieldId) {
        this.selectedField = null;
      }
    }
  }

  /**
   * Updates the properties of a form field
   */
  updateField(field: FormField): void {
    console.log("Updating field:", field);
    this.formBuilderService.updateFormField(field);
  }

  /**
   * Adds a new option to a radio button, dropdown, or checkbox group field
   */
  addOption(field: FormField): void {
    if (field.options) {
      // Create a new option with a unique name
      const optionNumber = field.options.length + 1;
      const newOption: FieldOption = {
        label: `Display text ${optionNumber}`,
        value: `option${optionNumber}`,
      };

      // Create a completely new options array
      const newOptions = Array.from(field.options);
      newOptions.push(newOption);

      // Update the field with the new options array
      const updatedField: FormField = {
        ...field,
        options: newOptions,
      };

      console.log("Adding option to field:", updatedField);
      this.formBuilderService.updateFormField(updatedField);

      // Update the local selected field reference to ensure UI is in sync
      this.selectedField = updatedField;
    }
  }

  /**
   * Removes an option from a radio button, dropdown, or checkbox group field
   */
  removeOption(field: FormField, optionIndex: number): void {
    if (field.options && field.options.length > 1) {
      const updatedOptions = [...field.options];
      updatedOptions.splice(optionIndex, 1);
      const updatedField = {
        ...field,
        options: updatedOptions,
      };
      console.log("Removing option from field:", updatedField);
      this.formBuilderService.updateFormField(updatedField);

      // Update the local selected field reference to ensure UI is in sync
      this.selectedField = updatedField;
    }
  }

  /**
   * Updates an option for a radio button, dropdown, or checkbox group field
   */
  updateOptionLabel(
    field: FormField,
    optionIndex: number,
    label: string
  ): void {
    if (field.options && field.options[optionIndex] !== undefined) {
      // Create a completely new options array to avoid reference issues
      const updatedOptions = field.options.map((opt, idx) => {
        // Only update the specific option at the given index
        if (idx === optionIndex) {
          return {
            ...opt,
            label: label,
          };
        }
        return opt;
      });

      // Create a new field object with the updated options
      const updatedField = {
        ...field,
        options: updatedOptions,
      };

      console.log("Updating option label in field:", updatedField);
      this.formBuilderService.updateFormField(updatedField);

      // Update the local selected field reference to ensure UI is in sync
      this.selectedField = updatedField;
    }
  }

  /**
   * Updates an option value for a radio button, dropdown, or checkbox group field
   */
  updateOptionValue(
    field: FormField,
    optionIndex: number,
    value: string
  ): void {
    if (field.options && field.options[optionIndex] !== undefined) {
      // Create a completely new options array to avoid reference issues
      const updatedOptions = field.options.map((opt, idx) => {
        // Only update the specific option at the given index
        if (idx === optionIndex) {
          return {
            ...opt,
            value: value,
          };
        }
        return opt;
      });

      // Create a new field object with the updated options
      const updatedField = {
        ...field,
        options: updatedOptions,
      };

      console.log("Updating option value in field:", updatedField);
      this.formBuilderService.updateFormField(updatedField);

      // Update the local selected field reference to ensure UI is in sync
      this.selectedField = updatedField;
    }
  }

  /**
   * Safe access to options length
   */
  getOptionsLength(field: FormField | null): number {
    return field?.options?.length || 0;
  }

  /**
   * Closes the field editor
   */
  closeEditor(): void {
    this.selectedField = null;
  }

  /**
   * Update option label in real-time as user types
   */
  tempOptionLabelUpdate(index: number, label: string): void {
    if (
      this.selectedField &&
      this.selectedField.options &&
      index >= 0 &&
      index < this.selectedField.options.length
    ) {
      // Update the option label directly
      this.updateOptionLabel(this.selectedField, index, label);
    }
  }

  /**
   * Update option value in real-time as user types
   */
  tempOptionValueUpdate(index: number, value: string): void {
    if (
      this.selectedField &&
      this.selectedField.options &&
      index >= 0 &&
      index < this.selectedField.options.length
    ) {
      // Update the option value directly
      this.updateOptionValue(this.selectedField, index, value);
    }
  }

  /**
   * Handle blur event for label field
   */
  handleLabelBlur(event: FocusEvent): void {
    console.log("Label blur event triggered", event);
    if (this.selectedField) {
      const target = event.target as HTMLInputElement;
      console.log("Label value:", target.value);
      this.selectedField.label = target.value;
      this.updateField(this.selectedField);
    }
  }

  /**
   * Handle blur event for option label field
   */
  handleOptionLabelBlur(event: FocusEvent, index: number): void {
    if (
      this.selectedField &&
      this.selectedField.options &&
      index >= 0 &&
      index < this.selectedField.options.length
    ) {
      const target = event.target as HTMLInputElement;
      const label = target.value;
      this.updateOptionLabel(this.selectedField, index, label);
    }
  }

  /**
   * Handle blur event for option value field
   */
  handleOptionValueBlur(event: FocusEvent, index: number): void {
    if (
      this.selectedField &&
      this.selectedField.options &&
      index >= 0 &&
      index < this.selectedField.options.length
    ) {
      const target = event.target as HTMLInputElement;
      const value = target.value;
      this.updateOptionValue(this.selectedField, index, value);
    }
  }

  /**
   * Handle blur event for placeholder field
   */
  handlePlaceholderBlur(event: FocusEvent): void {
    console.log("Placeholder blur event triggered", event);
    if (this.selectedField) {
      const target = event.target as HTMLInputElement;
      console.log("Placeholder value:", target.value);
      this.selectedField.placeholder = target.value;
      this.updateField(this.selectedField);
    }
  }

  /**
   * Handle blur event for description field
   */
  handleDescriptionBlur(event: FocusEvent): void {
    if (this.selectedField) {
      const target = event.target as HTMLInputElement;
      this.selectedField.description = target.value;
      this.updateField(this.selectedField);
    }
  }

  /**
   * Handle blur event for file types field
   */
  handleFileTypesBlur(event: FocusEvent): void {
    if (this.selectedField) {
      const target = event.target as HTMLInputElement;
      this.selectedField.acceptedFileTypes = target.value;
      this.updateField(this.selectedField);
    }
  }
}
