import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ViewsComponent } from './views.component';
import { ModuleGuard } from '@app/shared/guards/guards/module.guard';

// const domainService = new DomainService(new LocalStoreService());
// const domainPath = domainService.getDomain();

const routes: Routes = [
  {
    path: '',
    component: ViewsComponent,
    children: [
      {
        path: '',
        loadChildren: (): Promise<any> =>
          import('./inicio/inicio.routing')
            .then(m => m.InicioRoutingModule),
        data: { home: 'home' },
      },
      {
        path: 'administracion',
        loadChildren: (): Promise<any> =>
          import('./administracion/administracion.module')
            .then(m => m.AdministracionModule),
        canActivate: [ModuleGuard],
      },
      {
        path: 'configuracion',
        loadChildren: (): Promise<any> =>
          import('./configuracion/configuracion.module')
            .then(m => m.ConfiguracionModule),
        canActivate: [ModuleGuard],
      },
      {
        path: 'planillas',
        loadChildren: (): Promise<any> =>
          import('./planillas/planillas.module')
            .then(m => m.PlanillasModule),
        canActivate: [ModuleGuard],
      },
      {
        path: 'caja',
        loadChildren: (): Promise<any> =>
          import('./caja/caja.module')
            .then(m => m.CajaModule),
        canActivate: [ModuleGuard],
      },

      {
        path: 'movimientos',
        loadChildren: (): Promise<any> =>
          import('./movimientos/movimientos.module')
            .then(m => m.MovimientosModule),
        canActivate: [ModuleGuard],
      },
      {
        path: 'operaciones-y-ventas',
        loadChildren: (): Promise<any> =>
          import('./operaciones/operaciones.module')
            .then(m => m.OperacionesModule),
        canActivate: [ModuleGuard],
      },
      {
        path: 'facturacion',
        loadChildren: (): Promise<any> =>
          import('./facturacion/facturacion.module')
            .then(m => m.FacturacionModule),
        canActivate: [ModuleGuard],
      },
    ],
  },


];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class ViewsRoutingModule { }
