import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CajaComponent } from './caja.component';
import { HomeCajaComponent } from './home-caja/home-caja.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { PlanCuentasComponent } from './mantenedores/plan-cuentas/plan-cuentas.component';
import { RegistrosComponent } from './mantenedores/registros/registros.component';
import { cajaRoutingModule } from './caja.routing';
import { GestionCuentasComponent } from './mantenedores/gestion-cuentas/gestion-cuentas.component';
import { IngresosComponent } from './mantenedores/ingresos/ingresos.component';
import { EgresosComponent } from './mantenedores/egresos/egresos.component';

@NgModule({
  declarations: [
    CajaComponent,
    HomeCajaComponent,
    PlanCuentasComponent,
    GestionCuentasComponent,
    IngresosComponent,
    EgresosComponent,
    RegistrosComponent,
  ],
  imports: [
    CommonModule,
    cajaRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
  ],
  exports: [
    CajaComponent,
    HomeCajaComponent,
    PlanCuentasComponent,
    GestionCuentasComponent,
    IngresosComponent,
    EgresosComponent,
    RegistrosComponent,
  ],
})
export class CajaModule { }

