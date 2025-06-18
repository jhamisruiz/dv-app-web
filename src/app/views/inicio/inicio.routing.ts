import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppHomeComponent } from './app-home/app-home.component';
import { ModuleGuard } from '@app/shared/guards/guards/module.guard';

const routes: Routes = [
  {
    path: '',
    component: AppHomeComponent,
    canActivate: [ModuleGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioRoutingModule { }
