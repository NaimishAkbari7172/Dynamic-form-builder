import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilderService } from './services/form-builder.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent {
  title = 'Dynamic Form Builder';
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private formBuilderService: FormBuilderService) {}

  /**
   * Exports the current form configuration as JSON
   */
  exportForm(): void {
    const formConfig = this.formBuilderService.getFormConfig();
    const jsonConfig = JSON.stringify(formConfig, null, 2);
    
    // Create a blob and download link for the JSON
    const blob = new Blob([jsonConfig], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'form-config.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Triggers the hidden file input to open the file browser
   */
  triggerImportInput(): void {
    this.fileInput.nativeElement.click();
  }

  /**
   * Handles the file input change event
   * Reads the selected JSON file and imports the form configuration
   */
  importForm(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const jsonConfig = JSON.parse(e.target?.result as string);
          this.formBuilderService.importFormConfig(jsonConfig);
          // Reset the file input for future imports
          input.value = '';
          
          // Display success message
          alert('Form configuration imported successfully!');
        } catch (error) {
          console.error('Error parsing form configuration:', error);
          alert('Error importing form configuration. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  }
}
