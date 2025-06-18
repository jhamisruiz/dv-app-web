import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfiguracionComponent } from './configuracion.component';
import { HomeConfiguracionComponent } from './home-configuracion/home-configuracion.component';
import { MenuComponent } from './menu/menu.component';
import { RolesComponent } from './roles/roles.component';
import { UserGuard } from '@app/shared/guards/guards/user.guard';

const routes: Routes = [
  {
    path: '',
    component: ConfiguracionComponent,
    children: [
      {
        path: '',
        component: HomeConfiguracionComponent,
      },
      {
        path: 'registro-de-menu',
        component: MenuComponent,
        canActivate: [UserGuard],
      },
      {
        path: 'registro-de-rol',
        component: RolesComponent,
        canActivate: [UserGuard],
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class ConfiguracionRoutingModule { }
