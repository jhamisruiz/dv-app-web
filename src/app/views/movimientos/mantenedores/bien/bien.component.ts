import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup, Validators } from '@angular/forms';
import { AbstractDocument } from '@app/shared/common/classes';
import { AppTableGrid } from '@app/shared/components/app-table-grid/app-table-grid.interface';
import { AppTable } from '@app/shared/components/app-table/app-table.interface';
import { UniqueCode } from '@app/shared/validators/unique-code';

@Component({
  selector: 'app-bien',
  templateUrl: './bien.component.html',
  styleUrls: ['./bien.component.scss'],
})
export class BienComponent extends AbstractDocument implements OnInit {
  fullPath = '/bien';

  headers: AppTable[] = [
    { field: 'id', label: 'id', visible: false },
    { field: 'codigo', label: 'codigo', filter: true },
    { field: 'nombre', label: 'nombre', filter: true },
    { field: 'codigo_expediente', label: 'Cod. expediente', filter: true },
    { field: 'numero_expediente', label: 'nro. expediente', visible: false },
    { field: 'descripcion', label: 'descripcion', filter: true },
    { field: 'habilitado', label: 'habilitado', type: 'habilitado' },
  ];

  form: UntypedFormGroup = this.fb.group(
    {
      id: [],
      codigo: [{ value: null, disabled: this.isEditMode }, [Validators.required],
      Validators.composeAsync([UniqueCode(this.codeValidator.bind(this))])],
      nombre: ['', [Validators.required]],
      descripcion: [],
      id_unidadmedida: ['', [Validators.required]],
      cantidad_total: ['', [Validators.required]],
      id_expediente: ['', [Validators.required]],
      habilitado: [true],
      detalle: [[]],
    },
  );

  parents=[
    { field: 'codigo', parentField: 'codigo' },
    { field: 'tipo_insumo', parentField: 'tipo_insumo' },
    { field: 'cantidad', parentField: 'cantidad' },
    { field: 'id_unidadmedida', parentField: 'id_unidadmedida' },
  ];

  headers_detalle: AppTableGrid[] = [
    { field: 'id', label: 'id', visible: false },
    // {
    //   field: 'id_insumo',
    //   label: 'insumo',
    //   type: 'suggest',
    //   optionValue: 'id',
    //   url: '/insumos-buscar',
    //   optLabel: 'nombre',
    //   codigo: 'codigo',
    //   parentsVals: this.parents,
    //   required: true,
    // },
    {
      field: 'id_insumo',
      label: 'insumo',
      optionLabel: 'nombre',
      optionValue: 'id',
      type: 'select',
      placeholder: 'Select. Insumo',
      url: '/insumos-buscar',
      Labels: ['codigo', 'nombre'],
      parentsVals: this.parents,
      isTemplete: true,
      separador: ' - ',
      required: true,
    },
    { field: 'tipo_insumo', label: 'tipo de insumo', type: 'text', disabled: true },
    {
      field: 'cantidad', label: 'cantidad',
      type: 'number', required: true,
      minFractionDigits: 2,
    },
    {
      field: 'id_unidadmedida',
      label: 'unidad medida',
      optionLabel: 'descripcion',
      optionValue: 'id',
      type: 'select',
      placeholder: 'Select. U.M.',
      url: '/unidad-medida-buscar',
      Labels: ['codigo', 'descripcion'],
      //parentsVals: [{ field: 'codigo', parentField: 'unidad_medida' }],
      isTemplete: true,
      separador: ' - ',
      required: true,
    },
  ];

  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  fbgroup(f: any): any {
    return this.fb.group(f);
  }

  updateDataResponse(e: any[]): void {
    const fieldName = 'detalle';
    if (e !== null) {
      const f = this.form.get([fieldName]) as UntypedFormArray;
      f.patchValue(e);
    }
  }

}
