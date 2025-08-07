import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovimientosComponent } from './movimientos.component';
import { HomeMovimientosComponent } from './home-movimientos/home-movimientos.component';
import { MovimientosRoutingModule } from './movimientos.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { BienComponent } from './mantenedores/bien/bien.component';
import { ServicioComponent } from './mantenedores/servicio/servicio.component';
import { CategoriaComponent } from './mantenedores/categoria/categoria.component';
import { ProductoComponent } from './mantenedores/producto/producto.component';

@NgModule({
  declarations: [
    MovimientosComponent,
    HomeMovimientosComponent,
    BienComponent,
    ServicioComponent,
    CategoriaComponent,
    ProductoComponent,
  ],
  imports: [
    CommonModule,
    MovimientosRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
  ],
  exports: [
    HomeMovimientosComponent,
    BienComponent,
    ServicioComponent,
    CategoriaComponent,
    ProductoComponent,
  ],
})
export class MovimientosModule { }
