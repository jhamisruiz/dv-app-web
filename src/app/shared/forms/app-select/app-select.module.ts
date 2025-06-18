import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSelectComponent } from './app-select.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BadgeModule } from 'primeng/badge';



@NgModule({
  declarations: [
    AppSelectComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputNumberModule,
    CascadeSelectModule,
    DropdownModule,
    MultiSelectModule,
    BadgeModule,
  ],
  exports: [AppSelectComponent],
})
export class AppSelectModule { }
