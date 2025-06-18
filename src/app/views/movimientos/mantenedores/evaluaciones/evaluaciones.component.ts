import { Component, OnInit, Injector } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup, Validators } from '@angular/forms';
import { AbstractDocument } from '@app/shared/common/classes';
import { AppTableGrid } from '@app/shared/components/app-table-grid/app-table-grid.interface';
import { AppTable } from '@app/shared/components/app-table/app-table.interface';
import { UniqueCode } from '@app/shared/validators/unique-code';

@Component({
  selector: 'app-evaluaciones',
  templateUrl: './evaluaciones.component.html',
  styleUrls: ['./evaluaciones.component.scss'],
})
export class EvaluacionesComponent extends AbstractDocument implements OnInit {
  fullPath = '/evaluacion';

  headers: AppTable[] = [
    { field: 'id', label: 'id', visible: false },
    { field: 'codigo', label: 'codigo', filter: true },
    { field: 'nombre', label: 'nombre', filter: true },
    { field: 'nombre_convocatoria', label: 'convocatoria', filter: true },
    { field: 'fecha_convocatoria', label: 'fecha convocatoria', filter: true },
    { field: 'codigo_expediente', label: 'Cod. expediente', filter: true },
    { field: 'numero_expediente', label: 'nro. expediente', visible: false },
    { field: 'postulaciones', label: 'postulaciones' },
    { field: 'nombre_insumo', label: 'insumo', visible: false },
    {
      field: 'estado', label: 'Evaluación Doc.', type: 'button',
      btnLabel:'Por Evaluar',
      btnClass: 'primary',
      ifBtnField: 'evaluacion_documentaria',
      ifBtnName: 'Evaluado',
      ifBtnClass: 'secondary',
    },
  ];

  form: UntypedFormGroup = this.fb.group(
    {
      id: [],
      id_empresa: [this.idempresa],// ERROR: agregar id_empresa a todos los formularios
      codigo: [{ value: null, disabled: this.isEditMode }, [Validators.required],
      Validators.composeAsync([UniqueCode(this.codeValidator.bind(this))])],
      nombre: ['', [Validators.required]],
      id_insumo: ['', [Validators.required]],
      id_unidadmedida: ['', [Validators.required]],
      id_usuario_evaluador: [''],
      id_usuario_creador: [{ value: this.idusuario, disabled: true }, [Validators.required]],
      id_convocatoria: [, [Validators.required]],
      estado_creado: [true],
      estado_evaluando: [false],
      estado_evaluado: [false],
      habilitado: [true],
      Lista_usuarios: [[]],
      Lista_proveedores: [[]],
      eveluacion_doc: [],
    },
  );

  parents = [
    { field: 'empresa_activi_economi_industrial', parentField: 'empresa_activi_economi_industrial' },
  ];
  headers_evaluacion: AppTableGrid[] = [
    { field: 'id', label: 'id', visible: false },
    // {
    //   field: 'id_proveedor',
    //   label: 'proveedor',
    //   optionLabel: 'empresa_razon_social',
    //   optionValue: 'id',
    //   type: 'select',
    //   placeholder: 'Select. Proveedor',
    //   url: '/proveedor-buscar',
    //   Labels: ['empresa_ruc', 'empresa_razon_social'],
    //   parentsVals: this.parents,
    //   isTemplete: true,
    //   separador: ' - ',
    //   required: true,
    // },
    {
      field: 'id_proveedor',
      label: 'proveedor',
      type: 'suggest',
      optionValue: 'id',
      dataKey: 'id',
      url: '/proveedor-buscar',
      optLabel: 'empresa_razon_social',
      Labels: ['empresa_ruc', 'empresa_razon_social'],
      codigo: 'empresa_ruc',
      parentsVals: this.parents,
      required: true,
      unique: true,
    },
    {
      field: 'empresa_activi_economi_industrial', label: 'CIIU', disabled: true,
    },

  ];

  parent = [
    { field: 'email', parentField: 'email' },
    { field: 'username', parentField: 'username' },
  ];

  headers_usu: AppTableGrid[] = [
    { field: 'id', label: 'id', visible: false },
    {
      field: 'id_usuario',
      label: 'usuario',
      optionLabel: 'nombre',
      optionValue: 'id',
      type: 'select',
      placeholder: 'Select. Usuario',
      url: '/usuario-buscar',
      Labels: ['nombres', 'apellidos'],
      parentsVals: this.parent,
      isTemplete: true,
      separador: ' - ',
      required: true,
      unique: true,
    },
    { field: 'email', label: 'email' },
    { field: 'username', label: 'username' },
  ];

  visible = false;

  meterGroup = [{ label: 'Evaluación Doc al', value: 0, color: '#3B82F6' }, { label: 'Evaluación Tecnica al', value: 0, color: '#34d399' }];

  constructor(
    injector: Injector,
  ) {
    super(injector);
    this.onSubmitResponse.subscribe((f: any) => {
      const form = f?.data ?? f;
      if (form?.evaluacion_documentaria===true){
        const obj = this.meterGroup[0];
        obj.value =100;
      }
    });
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  selectInsumo(e: any): void {
    this.form.patchValue({
      nombre: `EVALUACION ${e.nombre}`.toUpperCase(),
      id_unidadmedida: e.id_unidadmedida,
    });
  }

  updateDataResponse(e: any[]): void {
    const fieldName = 'Lista_proveedores';
    if (e !== null) {
      const f = this.form.get([fieldName]) as UntypedFormArray;
      f.patchValue(e);
    }
  }

  updateDataResponseUsu(e: any[]): void {
    const fieldName = 'Lista_usuarios';
    if (e !== null) {
      const f = this.form.get([fieldName]) as UntypedFormArray;
      f.patchValue(e);
    }
  }

}
