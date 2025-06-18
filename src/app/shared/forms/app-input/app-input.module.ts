import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppInputComponent } from './app-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';



@NgModule({
  declarations: [
    AppInputComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputNumberModule,
    CalendarModule,
  ],
  exports: [AppInputComponent],
})
export class AppInputModule { }
