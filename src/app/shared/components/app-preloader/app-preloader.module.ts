import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppPreloaderComponent } from './app-preloader.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [AppPreloaderComponent],
  exports: [AppPreloaderComponent],
})
export class AppPreloaderModule { }
