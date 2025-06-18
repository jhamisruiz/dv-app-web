import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppToolComponent } from './app-tool.component';
import { FormsModule } from '@angular/forms';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ContextMenuModule,
    ToastModule,
    MessagesModule,
    ToolbarModule,
    ButtonModule,
    SplitButtonModule,
    TooltipModule,
    ConfirmDialogModule,
  ],
  declarations: [AppToolComponent],
  exports: [AppToolComponent],
})
export class AppToolModule { }
