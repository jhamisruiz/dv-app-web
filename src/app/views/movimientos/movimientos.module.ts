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
import { InsumoComponent } from './mantenedores/insumo/insumo.component';
import { ServicioComponent } from './mantenedores/servicio/servicio.component';
import { EvaluacionesComponent } from './mantenedores/evaluaciones/evaluaciones.component';
import { ExpedientesComponent } from './mantenedores/expedientes/expedientes.component';
import { EvaluacionTecnicaComponent } from './mantenedores/evaluacion-tecnica/evaluacion-tecnica.component';
import { EvaluacionDocumentariaComponent } from './mantenedores/evaluacion-documentaria/evaluacion-documentaria.component';
import { ResultadoEvaluacionComponent } from './mantenedores/resultado-evaluacion/resultado-evaluacion.component';
import { ConvocatoriasComponent } from './mantenedores/convocatorias/convocatorias.component';
import { EvaluacionCumpliminetoComponent } from './mantenedores/evaluacion-cumplimineto/evaluacion-cumplimineto.component';

@NgModule({
  declarations: [
    MovimientosComponent,
    HomeMovimientosComponent,
    BienComponent,
    InsumoComponent,
    ServicioComponent,
    EvaluacionesComponent,
    ExpedientesComponent,
    EvaluacionTecnicaComponent,
    EvaluacionDocumentariaComponent,
    ResultadoEvaluacionComponent,
    ConvocatoriasComponent,
    EvaluacionCumpliminetoComponent,
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
    InsumoComponent,
    ServicioComponent,
    EvaluacionesComponent,
    ExpedientesComponent,
    EvaluacionTecnicaComponent,
    EvaluacionDocumentariaComponent,
    ResultadoEvaluacionComponent,
    ConvocatoriasComponent,
    EvaluacionCumpliminetoComponent,
  ],
})
export class MovimientosModule { }
