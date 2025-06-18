import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserGuard } from '@app/shared/guards/guards/user.guard';
import { MovimientosComponent } from './movimientos.component';
import { BienComponent } from './mantenedores/bien/bien.component';
import { InsumoComponent } from './mantenedores/insumo/insumo.component';
import { ServicioComponent } from './mantenedores/servicio/servicio.component';
import { EvaluacionesComponent } from './mantenedores/evaluaciones/evaluaciones.component';
import { ExpedientesComponent } from './mantenedores/expedientes/expedientes.component';
import { EvaluacionTecnicaComponent } from './mantenedores/evaluacion-tecnica/evaluacion-tecnica.component';
import { HomeMovimientosComponent } from './home-movimientos/home-movimientos.component';
import { EvaluacionDocumentariaComponent } from './mantenedores/evaluacion-documentaria/evaluacion-documentaria.component';
import { ResultadoEvaluacionComponent } from './mantenedores/resultado-evaluacion/resultado-evaluacion.component';
import { ConvocatoriasComponent } from './mantenedores/convocatorias/convocatorias.component';
import { EvaluacionCumpliminetoComponent } from './mantenedores/evaluacion-cumplimineto/evaluacion-cumplimineto.component';

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
        path: 'registro-de-insumos',
        component: InsumoComponent,
         canActivate: [UserGuard],
      },
      {
        path: 'registro-de-servicios',
        component: ServicioComponent,
         canActivate: [UserGuard],
      },
      {
        path: 'registro-de-evaluaciones',
        component: EvaluacionesComponent,
        canActivate: [UserGuard],
      },
      {
        path: 'registro-de-expedientes',
        component: ExpedientesComponent,
        canActivate: [UserGuard],
      },
      {
        path: 'evaluacion-documentaria',
        component: EvaluacionDocumentariaComponent,
        canActivate: [UserGuard],
      },
      {
        path: 'evaluacion-tecnica',
        component: EvaluacionTecnicaComponent,
        canActivate: [UserGuard],
      },
      {
        path: 'resultado-de-evaluacion',
        component: ResultadoEvaluacionComponent,
        canActivate: [UserGuard],
      },
      {
        path: 'registro-de-convocatorias',
        component: ConvocatoriasComponent,
        canActivate: [UserGuard],
      },
      {
        path: 'criterios-de-evaluacion',
        component: EvaluacionCumpliminetoComponent,
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
