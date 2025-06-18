import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppUbigeoComponent } from './app-ubigeo.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [AppUbigeoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    MultiSelectModule,
    DropdownModule,
  ],
  exports: [AppUbigeoComponent],
})
export class AppUbigeoModule { }
