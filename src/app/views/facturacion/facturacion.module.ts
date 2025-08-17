import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacturacionComponent } from './facturacion.component';
import { HomeFacturacionComponent } from './home-facturacion/home-facturacion.component';
import { BoletaComponent } from './mantenedores/boleta/boleta.component';
import { FacturaComponent } from './mantenedores/factura/factura.component';
import { NotaCreditoComponent } from './mantenedores/nota-credito/nota-credito.component';
import { NotaDebitoComponent } from './mantenedores/nota-debito/nota-debito.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@app/shared/shared.module';
import { FacturacionRoutingModule } from './facturacion.routing';

@NgModule({
  declarations: [
    FacturacionComponent,
    HomeFacturacionComponent,
    BoletaComponent,
    FacturaComponent,
    NotaCreditoComponent,
    NotaDebitoComponent,
  ],
  imports: [
    CommonModule,
    FacturacionRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
  ],
  exports: [
    HomeFacturacionComponent,
    BoletaComponent,
    FacturaComponent,
    NotaCreditoComponent,
    NotaDebitoComponent,
  ],
})
export class FacturacionModule { }
