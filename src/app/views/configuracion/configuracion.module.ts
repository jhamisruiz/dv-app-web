import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ConfiguracionComponent } from './configuracion.component';
import { HomeConfiguracionComponent } from './home-configuracion/home-configuracion.component';
import { MenuComponent } from './menu/menu.component';
import { RolesComponent } from './roles/roles.component';
import { ConfiguracionRoutingModule } from './configuracion.routing';

@NgModule({
  declarations: [
    ConfiguracionComponent,
    HomeConfiguracionComponent,
    MenuComponent,
    RolesComponent,
  ],
  imports: [
    CommonModule,
    ConfiguracionRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
  ],
  exports: [
    ConfiguracionComponent,
    HomeConfiguracionComponent,
    MenuComponent,
    RolesComponent,
  ],
})
export class ConfiguracionModule { }
