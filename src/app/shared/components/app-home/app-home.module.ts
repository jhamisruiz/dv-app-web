import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppHomeComponent } from './app-home.component';
import { RouterModule } from '@angular/router';
import { AppSelectModule } from '../../forms/app-select/app-select.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppHomeComponent],
  imports: [
    CommonModule,
    RouterModule,
    AppSelectModule,
    FormsModule,
  ],
  exports: [
    AppHomeComponent,
  ],
})
export class AppHomeModule { }
