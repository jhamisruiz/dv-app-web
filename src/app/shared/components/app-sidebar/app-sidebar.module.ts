import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSidebarComponent } from './app-sidebar.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarModule } from 'primeng/sidebar';
import { AppPreloaderModule } from '../app-preloader/app-preloader.module';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    SidebarModule,
    AppPreloaderModule,
  ],
  declarations: [
    AppSidebarComponent,
  ],
  exports: [
    AppSidebarComponent,
  ],

})
export class AppSidebarModule { }
