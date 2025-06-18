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

@NgModule({
  declarations: [
    CajaComponent,
    HomeCajaComponent,
    PlanCuentasComponent,
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
    RegistrosComponent,
  ],
})
export class CajaModule { }

