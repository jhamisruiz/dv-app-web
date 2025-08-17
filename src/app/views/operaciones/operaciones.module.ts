import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperacionesComponent } from './operaciones.component';
import { HomeOperacionesComponent } from './home-operaciones/home-operaciones.component';
import { OperacionesRoutingModule } from './operaciones.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { PedidoComponent } from './mantenedores/pedido/pedido.component';

@NgModule({
  declarations: [
    OperacionesComponent,
    HomeOperacionesComponent,
    PedidoComponent,
  ],
  imports: [
    CommonModule,
    OperacionesRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
  ],
  exports: [
    HomeOperacionesComponent,
    PedidoComponent,
  ],
})
export class OperacionesModule { }
