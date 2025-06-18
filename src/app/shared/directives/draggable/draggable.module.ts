import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDraggableDirective } from './app-draggable.directive';
import { AppParentDirective } from './app-parent.directive';
import { AppChildDirective } from './app-child.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    AppDraggableDirective,
    AppParentDirective,
    AppChildDirective,
  ],
  exports: [
    AppDraggableDirective,
    AppParentDirective,
    AppChildDirective,
  ],
})
export class DraggableModule { }
