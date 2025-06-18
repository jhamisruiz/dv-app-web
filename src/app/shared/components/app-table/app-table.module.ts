import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppTableComponent } from './app-table.component';
import { AppPrimengModule } from '@app/shared/primeng/primeng.module';



@NgModule({
  declarations: [AppTableComponent],
  imports: [
    CommonModule,
    FormsModule,
    AppPrimengModule,
  ],
  providers: [
    DatePipe,
  ],
  exports: [AppTableComponent],
})
export class AppTableModule { }
