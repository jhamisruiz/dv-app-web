import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppInputFileComponent } from './app-input-file.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [AppInputFileComponent],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    MultiSelectModule,
    DropdownModule,
  ],
  exports: [AppInputFileComponent],
})
export class AppInputFileModule { }
