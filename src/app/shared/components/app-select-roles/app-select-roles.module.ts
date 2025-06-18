import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSelectRolesComponent } from './app-select-roles.component';
import { AppPrimengModule } from '@app/shared/primeng/primeng.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AppSelectRolesComponent],
  imports: [
    CommonModule,
    AppPrimengModule,
    FormsModule,
    TranslateModule,
  ],
  exports: [AppSelectRolesComponent],
})
export class AppSelectRolesModule { }
