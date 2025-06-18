import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnspscComponent } from './unspsc.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BadgeModule } from 'primeng/badge';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
  declarations: [UnspscComponent],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    MultiSelectModule,
    DropdownModule,
    DialogModule,
    AutoCompleteModule,
    BadgeModule,
    ProgressSpinnerModule,
  ],
  exports: [UnspscComponent],
})
export class UnspscModule { }
