import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup, Validators } from '@angular/forms';
import { AbstractDocument } from '@app/shared/common/classes';
import { AppTableGrid } from '@app/shared/components/app-table-grid/app-table-grid.interface';
import { AppTable } from '@app/shared/components/app-table/app-table.interface';
import { UniqueCode } from '@app/shared/validators/unique-code';

@Component({
  selector: 'app-insumo',
  templateUrl: './insumo.component.html',
  styleUrls: ['./insumo.component.scss'],
})
export class InsumoComponent extends AbstractDocument implements OnInit {
  fullPath = '/insumos';

  headers: AppTable[] = [
    { field: 'id', label: 'id', visible: false },
    { field: 'codigo', label: 'codigo', filter: true },
    { field: 'tipo_insumo', label: 'tipo de insumo', filter: true },
    { field: 'nombre', label: 'nombre', filter: true },
    { field: 'codigo_expediente', label: 'Cod. expediente', filter: true },
    { field: 'numero_expediente', label: 'nro. expediente', visible: false },
    { field: 'cantidad', label: 'cantidad' },
    { field: 'habilitado', label: 'habilitado', type: 'habilitado' },
  ];

  form: UntypedFormGroup = this.fb.group(
    {
      id: [],
      codigo: [{ value: null, disabled: this.isEditMode }, [Validators.required],
      Validators.composeAsync([UniqueCode(this.codeValidator.bind(this))])],
      tipo_insumo: ['', [Validators.required]],
      cantidad: [null, [Validators.required]],
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      id_unidadmedida: [0, [Validators.required]],
      id_bien: ['', [Validators.required]],
      precio_referencial: ['', [Validators.required]],
      moneda:['SOLES'],
      detalle_bienes: [[]],
      habilitado: [true],
    },
  );

  parents = [
    { field: 'codigo', parentField: 'codigo' },
    { field: 'id_expediente', parentField: 'id_expediente' },
    { field: 'cantidad_total', parentField: 'cantidad_total' },
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
      field: 'id_bien',
      label: 'bien',
      optionLabel: 'nombre',
      optionValue: 'id',
      type: 'select',
      placeholder: 'Select. Bien',
      url: '/bien-buscar',
      Labels: ['codigo', 'nombre'],
      parentsVals: this.parents,
      isTemplete: true,
      separador: ' - ',
      required: true,
      unique: true,
    },
    {
      field: 'id_expediente',
      label: 'expediente',
      optionLabel: 'nombre_expediente',
      optionValue: 'id',
      type: 'select',
      placeholder: 'Select. Expe',
      url: '/expediente-buscar',
      Labels: ['codigo', 'nombre_expediente'],
      // parentsVals: [{ field: 'codigo', parentField: 'unidad_medida' }],
      isTemplete: true,
      separador: ' - ',
      required: true,
      disabled: true,
    },
    {
      field: 'cantidad_total', label: 'cantidad',
      type: 'number', required: true,
      minFractionDigits: 2, disabled: true,
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
      // parentsVals: [{ field: 'codigo', parentField: 'unidad_medida' }],
      isTemplete: true,
      separador: ' - ',
      required: true,
      disabled: true,
    },
    {
      field: 'id_bien',
      label: 'bien',
      optionLabel: 'descripcion',
      optionValue: 'id',
      type: 'select',
      placeholder: 'Select. Bien',
      url: '/bien-buscar',
      Labels: ['codigo', 'descripcion'],
      // parentsVals: [{ field: 'codigo', parentField: 'unidad_medida' }],
      isTemplete: true,
      separador: ' - ',
      required: true,
      disabled: true,
    },
  ];

  dataGrupo: any[] = [
    {
      nombre: 'PRINCIPAL',
      codigo: 'PRINCIPAL',
    },
    {
      nombre: 'COMPLEMENTARIO',
      codigo: 'COMPLEMENTARIO',
    },
    {
      nombre: 'AVIO DE ACABADO',
      codigo: 'AVIO DE ACABADO',
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

  updateDataResponse(e: any[]): void {
    const fieldName = 'detalle_bienes';
    if (e !== null) {
      const f = this.form.get([fieldName]) as UntypedFormArray;
      f.patchValue(e);
    }
  }

}
