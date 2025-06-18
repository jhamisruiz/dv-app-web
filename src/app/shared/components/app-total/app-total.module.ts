import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTotalComponent } from './app-total.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppTotalComponent],
  imports: [
    CommonModule,
    FormsModule,
    InputNumberModule,
  ],
  exports: [
    AppTotalComponent,
  ],
})
export class AppTotalModule { }
