import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup, Validators } from '@angular/forms';
import { AbstractDocument } from '@app/shared/common/classes';
import { AppTableGrid } from '@app/shared/components/app-table-grid/app-table-grid.interface';
import { AppTable } from '@app/shared/components/app-table/app-table.interface';
import { UniqueDoc } from '@app/shared/validators/unique-document';
import { AppServicesService } from '@services/app-services/app-services.service';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.scss'],
})
export class PedidoComponent extends AbstractDocument implements OnInit {
  fullPath = '/pedido';
  data: any[] = [];
  headers: AppTable[] = [{ field: 'id', label: 'id', visible: false },
  { field: 'codigo', label: 'codigo', filter: true },
  { field: 'descripcion', label: 'descripcion', filter: true },
  { field: 'habilitado', label: 'habilitado', type: 'habilitado' },
  ];
  form: UntypedFormGroup = this.fb.group(
    {
      id: [],
      codigo: [],
      id_cupon: [],
      id_estado: [],
      numero_documento: [{ value: null, disabled: this.isEditMode }, [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{8}$/)],
      Validators.composeAsync([UniqueDoc(this.codeValidator.bind(this))])],
      id_cliente: [],
      id_usuario: [],
      cantidad: [],
      subtotal: [],
      descuento: [],
      precio_envio: [],
      total: [],
      id_metodopago: [],
      direccion: ['', [Validators.required]],
      referencia: [],
      ubigeo: [],
      geolocalizacion: [],
      fecha_creacion: [new Date().toISOString().slice(0, 10)],
      habilitado: [true],
      fecha_entrega: [],
      hora_entrega: [],
      tiempo_estimado: [],
      id_empresa: [],
      id_sucursal: [],

      detalle: [[]],

      departamento: [],
      provincia: [],
      distrito: [],

      nombres: [{ value: null, disabled: true },],
      apellidos: [{ value: null, disabled: true },],
    },
  );

  factores = {
    fieldA: 'cantidad',
    fieldB: 'precio',
    result: 'total'
  };
  headers_comp: AppTableGrid[] = [
    { field: 'id', label: 'id', visible: false },
    {
      field: 'id_producto',
      label: 'Producto',
      optionLabel: 'nombre',
      optionValue: 'id',
      type: 'select',
      placeholder: 'Select. Producto',
      url: '/producto-buscar',
      Labels: ['codigo', 'nombre'],
      parentsVals: [
        { field: 'precio', parentField: 'precio' },
      ],
      isTemplete: true,
      separador: ' - ',
      required: true,
    },
    {
      field: 'cantidad',
      label: 'cantidad', type: 'number', minFractionDigits: 0, inputMin: 1,
      required: true, showButtons: true,
      value: 1,
      multiplication: this.factores,
    },
    {
      field: 'precio', label: 'precio', type: 'number', minFractionDigits: 2,
      inputMin: 1, required: true, showButtons: true,
      multiplication: this.factores,
    },
    { field: 'total', label: 'total', minFractionDigits: 2, inputMin: 1, disabled: true, showButtons: true },
  ];

  constructor(
    injector: Injector,
    private sv: AppServicesService,
  ) { super(injector); }

  ngOnInit(): void {
    super.ngOnInit();
  }

  onInput(e: any): void {
    if (e?.length === 8) {
      this.sv.getDniRuc({ 'numero_documento': e }).subscribe((r: any) => {
        if (r) {
          console.log(r);
          this.form.patchValue({
            nombres: r?.nombres,
            apellidos: `${r?.apellidoPaterno} ${r?.apellidoMaterno}`,
            apellidoMaterno: r?.apellidoMaterno,
          });
        }
      });
    }
  }

  updateDataResponse(e: any[]): void {
    const fieldName = 'detalle';
    if (e !== null) {
      const f = this.form.get([fieldName]) as UntypedFormArray;
      f.patchValue(e);
    }
  }


  getUbigeo(e: any): void {
    this.form.patchValue({
      departamento: e.departamento,
      provincia: e.provincia,
      distrito: e.distrito,
      ubigeo: e.ubigeo,
    });
  }
}
