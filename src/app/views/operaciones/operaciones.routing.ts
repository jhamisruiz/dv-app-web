import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserGuard } from '@app/shared/guards/guards/user.guard';
import { OperacionesComponent } from './operaciones.component';
import { PedidoComponent } from './mantenedores/pedido/pedido.component';
import { HomeOperacionesComponent } from './home-operaciones/home-operaciones.component';

const routes: Routes = [
  {
    path: '',
    component: OperacionesComponent,
    children: [
      {
        path: '',
        component: HomeOperacionesComponent,
      },
      {
        path: 'registro-de-pedidos',
        component: PedidoComponent,
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

export class OperacionesRoutingModule { }
