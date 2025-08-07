import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserGuard } from '@app/shared/guards/guards/user.guard';
import { MovimientosComponent } from './movimientos.component';
import { BienComponent } from './mantenedores/bien/bien.component';
import { ServicioComponent } from './mantenedores/servicio/servicio.component';
import { HomeMovimientosComponent } from './home-movimientos/home-movimientos.component';
import { CategoriaComponent } from './mantenedores/categoria/categoria.component';
import { ProductoComponent } from './mantenedores/producto/producto.component';

const routes: Routes = [
  {
    path: '',
    component: MovimientosComponent,
    children: [
      {
        path: '',
        component: HomeMovimientosComponent,
      },
      {
        path: 'registro-de-bienes',
        component: BienComponent,
         canActivate: [UserGuard],
      },
      {
        path: 'registro-de-servicios',
        component: ServicioComponent,
         canActivate: [UserGuard],
      },
      {
        path: 'registro-de-categorias',
        component: CategoriaComponent,
        canActivate: [UserGuard],
      },
      {
        path: 'registro-de-productos',
        component: ProductoComponent,
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

export class MovimientosRoutingModule { }
