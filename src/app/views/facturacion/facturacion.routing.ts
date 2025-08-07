import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FacturacionComponent } from './facturacion.component';
import { HomeFacturacionComponent } from './home-facturacion/home-facturacion.component';
//import { FacturaComponent } from './mantenedores/factura/factura.component';
import { BoletaComponent } from './mantenedores/boleta/boleta.component';
import { NotaCreditoComponent } from './mantenedores/nota-credito/nota-credito.component';
import { NotaDebitoComponent } from './mantenedores/nota-debito/nota-debito.component';
import { UserGuard } from '@app/shared/guards/guards/user.guard';

const routes: Routes = [
  {
    path: '',
    component: FacturacionComponent,
    //canActivate: [UserGuard],
    children: [
      {
        path: '',
        component: HomeFacturacionComponent,
        //canActivate: [UserGuard],
      },
      {
        path: 'registro-de-facturas',
        //component: FacturaComponent,
        component: BoletaComponent,
        canActivate: [UserGuard],
      },
      {
        path: 'registro-de-boletas',
        component: BoletaComponent,
        canActivate: [UserGuard],
      },
      {
        path: 'registro-de-notas-de-credito',
        component: NotaCreditoComponent,
        canActivate: [UserGuard],
      },
      {
        path: 'registro-de-notas-de-debito',
        component: NotaDebitoComponent,
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

export class FacturacionRoutingModule { }
