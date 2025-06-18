import { Routes, RouterModule } from '@angular/router';
import { PlanillasComponent } from './planillas.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EmpleadoComponent } from './mantenedores/empleado/empleado.component';
import { EmpleadoReportesComponent } from './mantenedores/empleado-reportes/empleado-reportes.component';
import { HomePlanillasComponent } from './home-planillas/home-planillas.component';
import { UserGuard } from '@app/shared/guards/guards/user.guard';

const routes: Routes = [
  {
    path: '',
    component: PlanillasComponent,
    //canActivate: [UserGuard],
    children: [
      {
        path: '',
        component: HomePlanillasComponent,
        //canActivate: [UserGuard],
      },
      {
        path: 'registro-de-personal',
        component: EmpleadoComponent,
        canActivate: [UserGuard],
      },
      {
        path: 'registro-de-asistencia',
        component: EmpleadoReportesComponent,
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

export class PlanilasRoutingModule { }
