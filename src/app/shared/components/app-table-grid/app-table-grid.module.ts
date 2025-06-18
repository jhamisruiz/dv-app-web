import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTableGridComponent } from './app-table-grid.component';
import { FormsModule } from '@angular/forms';
import { AppPrimengModule } from '@app/shared/primeng/primeng.module';
import { TranslateModule } from '@ngx-translate/core';
import { AppEditTableDirective } from '@app/shared/directives/app';

@NgModule({
  declarations: [
    AppTableGridComponent,
    AppEditTableDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppPrimengModule,
    TranslateModule,
  ],

  exports: [AppTableGridComponent],
})
export class AppTableGridModule { }
