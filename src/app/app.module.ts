import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ToolboxComponent } from './components/toolbox/toolbox.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { FormFieldComponent } from './components/form-field/form-field.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolboxComponent,
    CanvasComponent,
    FormFieldComponent
  ],
  imports: [
    BrowserModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
