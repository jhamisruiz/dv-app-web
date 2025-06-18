import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministracionComponent } from './administracion.component';
import { UsuarioComponent } from './mantenedores/usuario/usuario.component';
import { HomeAdministracionComponent } from './home-administracion/home-administracion.component';
import { EmpresaComponent } from './mantenedores/empresa/empresa.component';
import { UserGuard } from '@app/shared/guards/guards/user.guard';
import { ProveedorComponent } from './mantenedores/proveedor/proveedor.component';
import { ProveedorNucleoComponent } from './mantenedores/proveedor-nucleo/proveedor-nucleo.component';

const routes: Routes = [
  {
    path: '',
    component: AdministracionComponent,
    children: [
      {
        path: '',
        component: HomeAdministracionComponent,
      },
      {
        path: 'registro-de-usuarios',
        component: UsuarioComponent,
        canActivate: [UserGuard],
      },
      {
        path: 'registro-de-empresas',
        component: EmpresaComponent,
        canActivate: [UserGuard],
      },
      {
        path: 'registro-de-proveedores',
        component: ProveedorComponent,
        canActivate: [UserGuard],
      },
      {
        path: 'registro-de-proveedor-nucleo',
        component: ProveedorNucleoComponent,
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

export class AdministracionRoutingModule { }
