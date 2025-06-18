import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanillasComponent } from './planillas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@app/shared/shared.module';
import { EmpleadoComponent } from './mantenedores/empleado/empleado.component';
import { EmpleadoReportesComponent } from './mantenedores/empleado-reportes/empleado-reportes.component';
import { RouterModule } from '@angular/router';
import { HomePlanillasComponent } from './home-planillas/home-planillas.component';
import { PlanilasRoutingModule } from './planillas.routing';

@NgModule({
  declarations: [
    PlanillasComponent,
    EmpleadoComponent,
    HomePlanillasComponent,
    EmpleadoReportesComponent,
  ],
  imports: [
    CommonModule,
    PlanilasRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
  ],
  exports: [
    EmpleadoComponent,
    HomePlanillasComponent,
    EmpleadoReportesComponent,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }],
})
export class PlanillasModule { }
