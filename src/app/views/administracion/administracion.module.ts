import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministracionComponent } from './administracion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HomeAdministracionComponent } from './home-administracion/home-administracion.component';
import { UsuarioComponent } from './mantenedores/usuario/usuario.component';
import { SharedModule } from '@app/shared/shared.module';
import { EmpresaComponent } from './mantenedores/empresa/empresa.component';
import { ProveedorComponent } from './mantenedores/proveedor/proveedor.component';
import { AdministracionRoutingModule } from './administracion.routing';
import { ProveedorNucleoComponent } from './mantenedores/proveedor-nucleo/proveedor-nucleo.component';

@NgModule({
  declarations: [AdministracionComponent,
    HomeAdministracionComponent,
    UsuarioComponent,
    EmpresaComponent,
    ProveedorComponent,
    ProveedorNucleoComponent,
  ],
  imports: [
    CommonModule,
    AdministracionRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
  ],
  exports: [
    HomeAdministracionComponent,
    UsuarioComponent,
    EmpresaComponent,
    ProveedorComponent,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }],
})
export class AdministracionModule { }
