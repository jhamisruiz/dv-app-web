import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CajaComponent } from './caja.component';
import { HomeCajaComponent } from './home-caja/home-caja.component';
import { PlanCuentasComponent } from './mantenedores/plan-cuentas/plan-cuentas.component';
import { RegistrosComponent } from './mantenedores/registros/registros.component';
import { UserGuard } from '@app/shared/guards/guards/user.guard';

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
        path: 'registros',
        component: RegistrosComponent,
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

export class cajaRoutingModule { }
