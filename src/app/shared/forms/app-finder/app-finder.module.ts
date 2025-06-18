import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppFinderComponent } from './app-finder.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BadgeModule } from 'primeng/badge';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';



@NgModule({
  declarations: [
    AppFinderComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputNumberModule,
    CascadeSelectModule,
    AutoCompleteModule,
    BadgeModule,
    DropdownModule,
    MultiSelectModule,
  ],
  exports: [AppFinderComponent],
})
export class AppFinderModule { }
