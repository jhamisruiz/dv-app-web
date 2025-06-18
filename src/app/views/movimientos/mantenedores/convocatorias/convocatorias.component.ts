import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup, Validators } from '@angular/forms';
import { AbstractDocument } from '@app/shared/common/classes';
import { AppTableGrid } from '@app/shared/components/app-table-grid/app-table-grid.interface';
import { AppTable } from '@app/shared/components/app-table/app-table.interface';
import { UniqueCode } from '@app/shared/validators/unique-code';

@Component({
  selector: 'app-convocatorias',
  templateUrl: './convocatorias.component.html',
  styleUrls: ['./convocatorias.component.scss'],
})
export class ConvocatoriasComponent extends AbstractDocument implements OnInit {
  fullPath = '/convocatoria';

  headers: AppTable[] = [
    { field: 'id', label: 'Id', visible: false },
    { field: 'codigo', label: 'Código', filter: true },
    { field: 'nombre', label: 'Nombre', filter: true },
    { field: 'fecha', label: 'Fecha Convocatoria', filter: true },
    { field: 'habilitado', label: 'Habilitado', type: 'habilitado' },
  ];

  form: UntypedFormGroup = this.fb.group(
    {
      id: [],
      nombre: ['', [Validators.required]],
      codigo: [{ value: null, disabled: this.isEditMode }, [Validators.required],
      Validators.composeAsync([UniqueCode(this.codeValidator.bind(this))])],
      fecha: ['', [Validators.required]],
      habilitado: [true],
      Lista_expedientes: [[]],
    },
  );

  parent = [
    //{ field: 'numero_expediente', parentField: 'numero_expediente' },
    { field: 'entidad_demandante', parentField: 'entidad_demandante' },
    { field: 'fecha_convenio', parentField: 'fecha_convenio' },
    { field: 'numero_resolucion', parentField: 'numero_resolucion' },
  ];

  headers_exp: AppTableGrid[] = [
    { field: 'id', label: 'id', visible: false },
    { field: 'id_convocatoria', label: 'id_convocatoria', visible: false },
    {
      field: 'id_expediente',
      label: 'expediente',
      optionLabel: 'nombre_expediente',
      optionValue: 'id',
      type: 'select',
      placeholder: 'Select. Expediente',
      url: '/expediente-buscar',
      Labels: ['codigo', 'nombre_expediente'],
      parentsVals: this.parent,
      isTemplete: true,
      separador: ' - ',
      required: true,
      unique: true,
    },
    //{ field: 'numero_expediente', label: 'Nro expediente',required: true, disabled:true },
    { field: 'entidad_demandante', label: 'entidad demandante',required: true, disabled:true },
    { field: 'fecha_convenio', label: 'fecha convenio',required: true, disabled:true },
    { field: 'numero_resolucion', label: 'Nro resolucion',required: true, disabled:true },
  ];
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  updateDataResponseUsu(e: any[]): void {
    const fieldName = 'Lista_expedientes';
    if (e !== null) {
      const f = this.form.get([fieldName]) as UntypedFormArray;
      f.patchValue(e);
    }
  }
}
