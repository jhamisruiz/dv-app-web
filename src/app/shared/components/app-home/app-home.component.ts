import { Component, Input, OnInit } from '@angular/core';
import { AppConfigService } from '@app/shared/services/config.service';

@Component({
  selector: 'app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.scss'],
})
export class AppHomeComponent implements OnInit {
  @Input() moduloName?: string;
  @Input() empresa?: false;

  componentes: any[] = [];

  id_empresa = 0;
  id_sucursal = 0;
  pathSucursal = '/sucursal-empresa?start=0&length=10&search=&order=asc&cod=0&cod=0';
  constructor(private sv: AppConfigService) {

  }

  ngOnInit(): void {
    this.sv.getComponents$.subscribe((r) => {
      if (r) {
        if (this.moduloName) {
          const cmpnt = r.find((c: any) => c?.nombre === this.moduloName);
          this.componentes = cmpnt?.componentes ?? [];
        }

        if (this.moduloName === 'home') {
          this.componentes = r;
        }
      }
    });//'Administracion'
  }
  selectChange(e: any): void {
    const code = e > 0 ? e : 0;
    this.pathSucursal = `/sucursal-empresa?start=0&length=10&search=&order=asc&cod=${code}&doc=1`;
  }

  OnChange(e: any): void {
    //const fieldName = 'emisor';
    if (e) {
      /* const f = this.form.get([fieldName]) as UntypedFormGroup;
      f.patchValue({
        nombre_comercial: e?.nombre_comercial,
        razon_social: e?.razon_social,
        direccion: e?.direccion,
        numero_documento: e?.numero_documento,
        departamento: e?.departamento,
        provincia: e?.provincia,
        distrito: e?.distrito,
        ubigeo: e?.ubigeo,
        usuario_emisor: e?.usuario_emisor,
        clave_emisor: e?.clave_emisor,
        clave_certificado: e?.clave_certificado,
      }); */
    }
  }

}
