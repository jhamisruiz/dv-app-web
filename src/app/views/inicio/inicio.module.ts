import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppLoginComponent } from './app-login/app-login.component';
import { SharedModule } from '@app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppHomeComponent } from './app-home/app-home.component';

@NgModule({
  declarations: [
    AppLoginComponent,
    AppHomeComponent,
  ],
  imports: [
    //BrowserModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
  ],
  exports: [
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
})
export class InicioModule { }
