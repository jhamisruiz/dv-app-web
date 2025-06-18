import { Component, OnInit, Injector } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { AbstractDocument } from '@app/shared/common/classes';
import { AppTable } from '@app/shared/components/app-table/app-table.interface';
import { UniqueDoc } from '@app/shared/validators/unique-document';
import { AppServicesService } from '@app/shared/services/app-services/app-services.service';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.scss'],
})
export class ProveedorComponent extends AbstractDocument implements OnInit {
  fullPath = '/proveedor';

  datosEmpresa = false;
  repreLegal = false;
  contanctEmpresa = false;
  ventaProduccion = false;

  headers: AppTable[] = [
    { field: 'id', label: 'id', visible: false },
    { field: 'empresa_ruc', label: 'numero documento', filter: true },
    { field: 'empresa_razon_social', label: 'razon social', thStyle: { 'max-width': '200px;' }, filter: true },
    { field: 'empresa_activi_economi_industrial', label: 'CIIU', filter: true },
    { field: 'represen_nombre', label: 'nombre representante', filter: true },
    { field: 'represen_cargo', label: 'cargo', filter: true },
    { field: 'represen_email', label: 'email', filter: true },
    { field: 'represen_telefono', label: 'telefono' },
    { field: 'habilitado', label: 'habilitado', type: 'habilitado' },
  ];

  form: UntypedFormGroup = this.fb.group(
    {
      id: [],
      empresa_ruc: [{ value: '', disabled: this.isEditMode }, [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{11}$/)],
      Validators.composeAsync([UniqueDoc(this.codeValidator.bind(this))])],
      //ERROR: NO ES POR CODIGO, ES POR NUMERO DE DOCUMENTO
      empresa_razon_social: ['', [Validators.required]],
      empresa_email: ['', [Validators.required]],
      empresa_fabricante: [true],
      empresa_distribuidor: [false],
      empresa_servicios: [false],
      empresa_domici_legal: ['', [Validators.required]],
      empresa_ubigeo: ['', [Validators.required]],
      empresa_direcc_planta: ['', [Validators.required]],
      empresa_ubigeo_planta: ['', [Validators.required]],
      empresa_licen_funciona_vigente: ['', [Validators.required]],
      empresa_inicio_activi: ['', [Validators.required]],
      empresa_inscrita_sunarp_ficha: ['', [Validators.required]],
      empresa_asiento: ['', [Validators.required]],
      empresa_activi_economi_industrial: ['', [Validators.required]],
      represen_nombre: ['', [Validators.required]],
      represen_dni: [null, [Validators.required]],
      represen_cargo: ['', [Validators.required]],
      represen_telefono: ['', [Validators.required]],
      represen_email: ['', [Validators.required]],
      contacto_nombre: ['', [Validators.required]],
      contacto_dni: ['', [Validators.required]],
      contacto_cargo: ['', [Validators.required]],
      contacto_telefono: ['', [Validators.required]],
      contacto_correo: ['', [Validators.required]],
      contacto_direccion_laboral: ['', [Validators.required]],
      venpro_capac_produc_mes: ['', [Validators.required]],
      venpro_bien_oferta_propu: ['', [Validators.required]],
      venpro_materia_prima_nacional: [true],
      venpro_materia_prima_importado: [false],
      venpro_hora_recep_expe_fisico: [],
      venpro_fecha_expe_fisico_postu: [new Date().toISOString().slice(0, 10)],
      habilitado: [true],
      fecha_registro: [new Date().toISOString().slice(0, 10)],
    },
  );

  dataGrupo: any[] = [
    {
      nombre: 'NACIONAL',
      codigo: 'NACIONAL',
    },
    {
      nombre: 'IMPORTADO',
      codigo: 'IMPORTADO',
    },
  ];

  constructor(
    injector: Injector,
    private sv: AppServicesService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  fbgroup(f: any): any {
    return this.fb.group(f);
  }

  getUbigeo(e: any): void {
    this.form.patchValue({
      empresa_ubigeo: e.ubigeo,
    });
  }

  getUbigeoPlanta(e: any): void {
    this.form.patchValue({
      empresa_ubigeo_planta: e.ubigeo,
    });
  }

  onInput(e: any): void {
    if (e?.length === 11) {
      this.sv.getDniRuc({ 'dni_ruc': e }).subscribe((r: any) => {
        if (r) {
          this.form.patchValue({
            empresa_razon_social: r?.nombre,
            departamento: r?.departamento,
            provincia: r?.provincia,
            distrito: r?.distrito,
            empresa_ubigeo: r?.ubigeo,
            empresa_domici_legal: r?.direccion,
          });
        }
      });
    }
  }

  onInputDNI(e: any): void {
    if (e?.length === 8) {
      this.sv.getDniRuc({ 'dni_ruc': e }).subscribe((r: any) => {
        if (r) {
          //represen_dni
           this.form.patchValue({
             represen_nombre: r?.nombre,
          });
        }
      });
    }
  }

  onInputDNICargo(e: any): void {
    if (e?.length === 8) {
      this.sv.getDniRuc({ 'dni_ruc': e }).subscribe((r: any) => {
        if (r) {
          this.form.patchValue({
            contacto_nombre: r?.nombre,
          });
        }
      });
    }
  }

}
