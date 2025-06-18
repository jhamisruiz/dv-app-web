import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppHeaderComponent } from './app-header.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { BadgeModule } from 'primeng/badge';
import { ChipModule } from 'primeng/chip';
import { ToastModule } from 'primeng/toast';
import { AppSelectModule } from '@app/shared/forms/app-select/app-select.module';
import { ButtonModule } from 'primeng/button';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    DialogModule,
    ToastModule,
    BadgeModule,
    ChipModule,
    AppSelectModule,
    ButtonModule,
  ],
  declarations: [AppHeaderComponent],
  exports: [AppHeaderComponent],
})
export class AppHeaderModule { }
