import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CajaComponent } from './caja.component';
import { HomeCajaComponent } from './home-caja/home-caja.component';
import { PlanCuentasComponent } from './mantenedores/plan-cuentas/plan-cuentas.component';
import { UserGuard } from '@app/shared/guards/guards/user.guard';
import { GestionCuentasComponent } from './mantenedores/gestion-cuentas/gestion-cuentas.component';
import { IngresosComponent } from './mantenedores/ingresos/ingresos.component';
import { EgresosComponent } from './mantenedores/egresos/egresos.component';

const routes: Routes = [
  {
    path: '',
    component: CajaComponent,
    children: [
      {
        path: '',
        component: HomeCajaComponent,
      },
      {
        path: 'plan-de-cuentas',
        component: PlanCuentasComponent,
        canActivate: [UserGuard],
      },
      {
        path: 'gestion-de-cuentas',
        component: GestionCuentasComponent,
        canActivate: [UserGuard],
      },
      {
        path: 'gestion-de-ingresos',
        component: IngresosComponent,
        canActivate: [UserGuard],
      },
      {
        path: 'gestion-de-egresos',
        component: EgresosComponent,
        canActivate: [UserGuard],
      }
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class cajaRoutingModule { }
