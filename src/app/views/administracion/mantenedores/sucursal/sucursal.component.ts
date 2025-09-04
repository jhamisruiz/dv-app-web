import { UntypedFormArray, UntypedFormGroup, Validators } from '@angular/forms';
import { AbstractDocument } from '@app/shared/common/classes';
import { Component, OnInit, Injector } from '@angular/core';
import { UniqueCode } from '@app/shared/validators/unique-code';
import { AppTableGrid } from '@app/shared/components/app-table-grid/app-table-grid.interface';
import { AppTable } from '@app/shared/components/app-table/app-table.interface';

@Component({
  selector: 'app-sucursal',
  templateUrl: './sucursal.component.html',
  styleUrls: ['./sucursal.component.scss'],
})

export class SucursalComponent extends AbstractDocument implements OnInit {
  fullPath = '/sucursal';
  headers: AppTable[] = [
    { field: 'id', label: 'id', visible: false },
    { field: 'razon_social', label: 'empresa' },
    { field: 'codigo', label: 'codigo sucursal' },
    { field: 'nombre', label: 'nombre sucursal' },
    { field: 'direccion', label: 'direccion' },
    { field: 'habilitado', label: 'habilitado', type: 'habilitado' },
  ];

  form: UntypedFormGroup = this.fb.group(
    {
      id: [],
      id_empresa: [{ value: this.idempresa, disabled: this.isEditMode }, [Validators.required]],
      codigo: [{ value: null, disabled: this.isEditMode }, Validators.composeAsync([UniqueCode(this.codeValidator.bind(this))])],
      nombre: ['', [Validators.required]],
      ubigeo: ['', [Validators.required]],
      direccion: [],
      telefono: [],
      email: [],
      fecha_creacion: [new Date().toISOString().slice(0, 10)],
      habilitado: [true],
      detalle: [[]],
    },
  );

  headers_sucursal_doc: AppTableGrid[] = [
    {
      field: 'id',
      label: 'id',
      visible: false,
    },
    {
      field: 'id_sucursal',
      label: 'id_sucursal',
      visible: false,
    },
    {
      field: 'iddocumento_electronico',
      label: 'tipo documento',
      optionLabel: 'nombre',
      optionValue: 'id',
      type: 'select',
      placeholder: 'Select. documento.',
      url: '/documento-electronico-buscar',
      isTemplete: true,
      Labels: ['codigo', 'nombre'],
      separador: ' - ',
      required: true,
      parentsVals: [{
        field: 'serie',
        parentField: 'serie',
      }],
    },
    {
      field: 'serie',
      label: 'serie',
      toUpperCase: true,
      required: true,
      unique: true,
    },
    {
      field: 'correlativo',
      label: 'correlativo',
      type: 'number',
      minFractionDigits: 0,
      required: true,
      value: 1,
    },
    {
      field: 'fecha_creacion',
      label: 'fecha_creacion',
      value: new Date().toISOString().slice(0, 10),
      visible: false,
    },
    {
      field: 'habilitado',
      label: 'habilitado',
      value: true,
      visible: false,
    },
  ];

  comumentos: any[] = [];
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  selectChange(e: any): void {
    if (this.isCreateMode && e?.ubigeo) {
      this.form.patchValue({ ubigeo: e?.ubigeo });
    }
    if (!this.isEditMode) {
      if (this.paramasCodeValidator) {
        this.form.patchValue({
          codigo: null,
        });
      }
      this.paramasCodeValidator = { idempresa: e?.id };
    }
  }

  getUbigeo(e: any): void {
    this.form.patchValue({
      // retorna departamento,provincia,distrito,ubigeo
      ubigeo: e.ubigeo,
    });
  }

  updateDataResponse(e: any[]): void {
    const fieldName = 'detalle';
    if (e !== null) {
      const f = this.form.get([fieldName]) as UntypedFormArray;
      f.patchValue(e);
    }
  }
}
