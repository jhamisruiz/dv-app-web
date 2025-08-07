import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup, Validators } from '@angular/forms';
import { AbstractDocument } from '@app/shared/common/classes';
import { AppTableGrid } from '@app/shared/components/app-table-grid/app-table-grid.interface';
import { AppTable } from '@app/shared/components/app-table/app-table.interface';
import { AppServicesService } from '@app/shared/services/app-services/app-services.service';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.scss'],
})
export class FacturaComponent extends AbstractDocument implements OnInit {
  fullPath = '/factura';
  activeEmpresa = false;
  activeCliente = false;
  activeDetalle = false;

  headers: AppTable[] = [{
    field: 'id',
    label: 'id',
    visible: false,
  },
  {
    field: 'nombre_documento',
    label: 'factura',
  },
  {
    field: 'pdf',
    label: 'pdf',
    type: 'button',
    btnClass: 'danger p-0 pt-1',
    icon: 'bxs-file-pdf text-white',
  },
  {
    field: 'xml',
    label: 'xml',
    type: 'button',
    btnClass: 'secondary p-0 pt-1',
    icon: 'ri-file-code-line text-white',
  },
  {
    field: 'cdr',
    label: 'cdr',
    type: 'button',
    btnClass: 'warning p-0 pt-1',
    icon: 'ri-file-zip-fill text-white',
  },
  {
    field: 'enviar_sunat',
    label: 'sunat',
    type: 'button',
    btnBool: true,
    btnClass: ' btn-light border border-success p-0 pt-1',
    icon: 'bx bxs-check-circle text-success',
    btnBoolClass: ' btn-light border border-white p-0 pt-1',
    btnBoolIcon: ' bx bx-cloud-upload text-white',
  },
  {
    field: 'correo',
    label: 'correo',
    type: 'button',
    btnClass: ' btn-light border border-danger p-0 pt-1',
    icon: 'bx bx-mail-send text-danger',
  },
  ];

  form: UntypedFormGroup = this.fb.group(
    {
      id: [],
      nombre_documento: [],
      emisor: this.fb.group({
        id_empresa: [{ value: this.idempresa, disabled: true }, [Validators.required]],
        id_sucursal: [{ value: this.idsucursal, disabled: true }, [Validators.required]],
        tipo_documento: ['6', [Validators.required]],
        numero_documento: [{ value: null, disabled: true }, [Validators.required]],
        razon_social: [{ value: null, disabled: true }, [Validators.required]],
        nombre_comercial: [{ value: null, disabled: true }],
        departamento: [{ value: null, disabled: false }],
        provincia: [{ value: null, disabled: false }],
        distrito: [{ value: null, disabled: false }],
        direccion: [{ value: null, disabled: false }],
        ubigeo: [{ value: null, disabled: false }],
        usuario_emisor: [{ value: null, disabled: false }],
        clave_emisor: [{ value: null, disabled: false }],
        clave_certificado: [{ value: null, disabled: false }],
        nombre_certificado: [{ value: null, disabled: false }],
      }),
      cliente: this.fb.group({
        tipo_documento: ['6', [Validators.required]],
        numero_documento: ['2044120445', [Validators.required]],
        razon_social: [, [Validators.required]],
        direccion: [, [Validators.required]],
        pais: ['PE'],
        id: [],
        email: [, [Validators.required]],
        id_ubigeo: [],
      }),
      tipo_comprobante: ['01', [Validators.required]],
      tipo_operacion: ['0101'],
      id_serie: [],
      anexo_sucursal: [1],
      serie: [{ value: null, disabled: false }, [Validators.required]],
      correlativo: [{ value: null, disabled: false }, [Validators.required]],
      codigo_moneda: ['PEN', [Validators.required]],
      fecha_emision: [, [Validators.required]],
      fecha_vencimiento: [],
      fecha_creacion: [new Date().toISOString().slice(0, 10)],
      forma_pago: ['Contado', [Validators.required]],
      numero_cuotas: [2],
      dias_cuotas: [],
      cuotas: [[]],
      habilitado: [true],
      detalle: [[], [Validators.required]],
      sub_total: [],
      descuento: [],
      subtotal_con_dscto: [],
      igv: [],
      op_exoneradas: [],
      op_inafectas: [],
      icbper: [],
      descuento_global: [],
      total: [],
      ///conf del tipo de envio
      enviar_email: [true],
      solo_guardar: [false],
      enviar_sunat: [true],
    },
  );
  headers_credito: AppTableGrid[] = [
    {
      field: 'id', label: 'id',
      visible: false,
    },
    {
      field: 'fecha_vencimiento', label: 'vencimiento',
      type: 'date',
      dateFormat: 'yy-mm-dd',
      required: true,
    },
    {
      field: 'importe', label: 'importe',
      type: 'number', prefix: 'S/',
      showButtons: true,
      minFractionDigits: 2,
      required: true, value: 1, inputMin: 0,
    },
  ];
  parents = [
    { field: 'idunidad_medida', parentField: 'idunidad_medida' },
    { field: 'nombre', parentField: 'nombre_producto' },
    { field: 'codigo', parentField: 'codigo' },
    { field: 'codigo_unspsc', parentField: 'codigo_unspsc' },
    { field: 'cantidad', parentField: 'cantidad_actual' },
    { field: 'descuento', parentField: 'descuento' },
    { field: 'precio', parentField: 'valor_unitario' },
    { field: 'id_tipoafectacion', parentField: 'id_tipoafectacion' },//para los sgt 10,20,30,..
    { field: 'factor_icbper', parentField: 'factor_icbper' },//..., 0.40, 0.50
    { field: 'afecto_icbper', parentField: 'afecto_icbper' },//0 or 1
  ];
  headers_detalle: AppTableGrid[] = [
    {
      field: 'id', label: 'id',
      visible: false,
      toModalVisible: false,
    },
    {
      field: 'id_producto',
      label: 'producto',
      type: 'suggest',
      optionValue: 'id',
      url: '/producto-buscar',
      optLabel: 'nombre',
      codigo: 'codigo',
      parentsVals: this.parents,
      required: true,
    },
    {
      field: 'nombre_producto', label: 'nombre_producto',
      visible: false,
      toModalVisible: false,
    },
    {
      field: 'codigo', label: 'codigo',
      toUpperCase: true,
      visible: false,
      toModalVisible: false,
    }, {
      field: 'codigo_unspsc', label: 'codigo_unspsc',
      toUpperCase: true,
      visible: false,
      toModalVisible: false,
    },
    {
      field: 'idunidad_medida',
      label: 'unidad medida',
      optionLabel: 'descripcion',
      optionValue: 'id',
      type: 'select',
      placeholder: 'Select. U.M.',
      url: '/producto-unidad-medida-buscar',
      Labels: ['codigo', 'descripcion'],
      parentsVals: [{ field: 'codigo', parentField: 'unidad_medida' }],
      isTemplete: true,
      separador: ' - ',
      required: true,
    },
    { field: 'unidad_medida', label: 'unidad_medida', visible: false, toModalVisible: false },
    {
      field: 'id_tipoafectacion', label: 't. afectacion',
      fieldname: 'codigos',
      obj_Value: 'id',
      optionLabel: 'descripcion',
      optionValue: 'id',
      type: 'select',
      placeholder: 'Select. T. afectacion',
      url: '/tipo-afectacion-buscar',
      Labels: ['codigo', 'nombre', 'descripcion'],
      parentsVals: [{ field: 'codigo', parentField: 'tipo_afectacion' }],
      isTemplete: true,
      required: true,
      inputMin: 0,
    },
    {
      field: 'afecto_icbper', label: 'afecto_icbper',
      type: 'number',
      visible: false,
      toModalVisible: false,
    },
    {
      field: 'cantidad_actual', label: 'cantidad actual',
      type: 'number',
      minFractionDigits: 2,
      colClass: 'col-xxl-2 col-md-3',
      visible: false,
      disabled: true,
    },
    {
      field: 'cantidad', label: 'cantidad',
      type: 'number',
      showButtons: true,
      minFractionDigits: 2,
      colClass: 'col-xxl-2 col-md-3',
      required: true,
      value: 1,
      inputMin: 0,
    },
    {
      field: 'valor_unitario', label: 'p. unitario',
      prefix: 'S/',
      type: 'number',
      showButtons: true,
      colClass: 'col-xxl-2 col-md-3',
      required: true,

    },
    {
      field: 'sub_total', label: 'sub total',
      inputMin: 0, prefix: 'S/',
      type: 'number',
      toModalVisible: false,
      disabled: true,
    },
    {
      field: 'descuento', label: 'descuento',
      inputMin: 0, prefix: 'S/',
      type: 'number',
      showButtons: true,
      toModalVisible: false,
    },
    {
      field: 'subtotal_con_dscto', label: 'sub total descuento',
      inputMin: 0, prefix: 'S/',
      type: 'number',
      toModalVisible: false,
      minFractionDigits: 2,
      visible: false,
    },
    { field: 'igv_porcentaje', label: 'igv_porcentaje', visible: false, toModalVisible: false },
    {
      field: 'igv', label: 'igv',
      inputMin: 0, prefix: 'S/',
      type: 'number',
      toModalVisible: false,
    },
    {
      field: 'factor_icbper', label: 'F. icbper',
      prefix: 'S/', inputMin: 0.1, inputMax: 0.9, step: 0.1,
      type: 'number', visible: false,
      showButtons: true,
      colClass: 'col-xxl-2 col-md-2',
    },
    {
      field: 'icbper', label: 'icbper',
      type: 'number', visible: false,
      toModalVisible: false,
    },
    {
      field: 'op_exoneradas', label: 'op_exoneradas',
      type: 'number', visible: false,
      toModalVisible: false,
    },
    {
      field: 'op_inafectas', label: 'op_inafectas',
      type: 'number', visible: false,
      toModalVisible: false,
    },
    {
      field: 'total', label: 'p. total',
      prefix: 'S/', inputMin: 0,
      type: 'number',
      toModalVisible: false,
      required: true,
    },
  ];
  pathSucursal = '/sucursal-empresa?start=0&length=10&search=&order=asc&cod=0&cod=0';

  mensaje: any;
  setMessageSunat!: any[];

  constructor(injector: Injector, private sv: AppServicesService,
  ) {
    super(injector);
    this.onSubmitResponse.subscribe((d: any) => {
      if (this.isEditMode) {
        if (d?.mensaje_sunat) {
          if (d?.mensaje_sunat.slice(0, 12) === 'ERROR[sunat]') {
            this.setMessageSunat = [{ severity: 'error', summary: 'Error Sunat', detail: d?.mensaje_sunat }];
          } else {
            this.setMessageSunat = [{ severity: 'success', summary: 'Success', detail: d?.mensaje_sunat }];
          }
        }
      }
    });
  }

  ngOnInit(): void {
    super.ngOnInit();
    //this.onDisable('EDIT');
    this.selectChange(this.idempresa);
  }
  updateCuotasResponse(e: any[]): void {
    const fieldName = 'cuotas';
    if (e !== null) {
      const f = this.form.get([fieldName]) as UntypedFormArray;
      f.patchValue(e);
    }
  }
  selectFormaPago(e: any): void {
    if (e === 'Contado') {
      this.updateCuotasResponse([]);
      this.form.patchValue({ numero_cuotas: 2, dias_cuotas: 1 });
    }
  }

  updateDataResponse(e: any[]): void {
    const fieldName = 'detalle';
    if (e !== null) {
      const f = this.form.get([fieldName]) as UntypedFormArray;
      f.patchValue(e);
    }
  }

  onInput(e: any): void {
    if (e?.length === 11) {
      this.sv.getDniRuc({ 'dni_ruc': e }).subscribe((r: any) => {
        const fieldName = 'cliente';
        if (r) {
          const f = this.form.get([fieldName]) as UntypedFormGroup;
          f.patchValue({
            razon_social: r?.nombre,
            direccion: r?.direccion,
            id: r?.id,
            email: r?.email,
            id_ubigeo: r?.ubigeo,
          });
        }
      });
    }
  }
  OnSuggestEmpresa(e: any): void {
    const fieldName = 'emisor';
    if (e && e?.certificado?.nombre && e?.clave_certificado) {
      const f = this.form.get([fieldName]) as UntypedFormGroup;
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
        nombre_certificado: e?.certificado?.nombre,
      });
    } else {
      this.mensaje = `Esta empresa ${e?.numero_documento} no puede facturar porque no tiene certificado o clave digital.`;
      this.onDisable('CREATE');
    }
  }

  selectChange(e: any): void {
    const code = e > 0 ? e : 0;
    this.pathSucursal = `/sucursal-empresa?start=0&length=10&search=&order=asc&cod=${code}&doc=1`;
    //cod=es el idempresa|doc=1= es el id documento electronico que referencia a 01 factura
  }

  OnSuggest(e: any): void {
    if (e?.detalle) {
      const d = e?.detalle;

      this.form.patchValue({
        id_serie: d.id,
        serie: d.serie,
        correlativo: d.correlativo,
        anexo_sucursal: e.codigo,
      });
    }
  }

  configRadio(e: any, n: string): void {
    if (n === 'enviar_email') {
      const ds = this.form.get('cliente') as UntypedFormGroup;
      const emailControl = ds?.get('email');

      if (emailControl) {
        if (e.checked) {
          emailControl.setValidators([Validators.required]);
        } else {
          emailControl.clearValidators();
        }
        emailControl.updateValueAndValidity();
      }
      return;
    }
    if (n === 'enviar_sunat') {
      this.form.patchValue({
        enviar_sunat: e.checked,
        solo_guardar: !e.checked,
      });
    }
    if (n === 'solo_guardar') {
      this.form.patchValue({
        enviar_sunat: !e.checked,
        solo_guardar: e.checked,
      });
    }
  }

  onCalc(e: any): void {
    this.form.patchValue({
      descuento_global: e ? e : 0,
    });
  }

}

///https://eliutimana.github.io/SunatCatalogos/cat-08.html#n%C2%B0-27-indicador-de-primera-vivienda
//https://github.com/jldamians/sunat-catalogs
