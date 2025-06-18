import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppPrimengModule } from './primeng/primeng.module';
import { AppHeaderModule } from './components/app-header/app-header.module';
import { AppSidebarModule } from './components/app-sidebar/app-sidebar.module';
import { AppInputModule } from './forms/app-input/app-input.module';
import { AppSelectModule } from './forms/app-select/app-select.module';
import { AppTableModule } from './components/app-table/app-table.module';
import { AppToolModule } from './components/app-tools/app-tool.module';
import { AppClickOutsideDirective } from './directives/app';
import { AppUbigeoModule } from './components/app-ubigeo/app-ubigeo.module';
import { AppInputFileModule } from './forms/app-input-file/app-input-file.module';
import { UnspscModule } from './components/unspsc/unspsc.module';
import { AppFinderModule } from './forms/app-finder/app-finder.module';
import { AppHomeModule } from './components/app-home/app-home.module';
import { AppTotalModule } from './components/app-total/app-total.module';
import { AppTableGridModule } from './components/app-table-grid/app-table-grid.module';
import { AppSelectRolesModule } from './components/app-select-roles/app-select-roles.module';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    AppClickOutsideDirective,
  ],
  exports: [
    AppPrimengModule,
    AppInputModule,
    AppInputFileModule,
    AppHeaderModule,
    AppSidebarModule,
    AppSelectModule,
    AppFinderModule,
    AppTableModule,
    AppTableGridModule,
    AppTotalModule,
    AppToolModule,
    AppUbigeoModule,
    UnspscModule,
    AppHomeModule,
    AppSelectRolesModule,
    //
    AppClickOutsideDirective,
  ],
})
export class SharedModule { }
