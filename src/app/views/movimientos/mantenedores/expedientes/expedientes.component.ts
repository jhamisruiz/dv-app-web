import { Component, OnInit, Injector } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup, Validators } from '@angular/forms';
import { AbstractDocument } from '@app/shared/common/classes';
import { AppTableGrid } from '@app/shared/components/app-table-grid/app-table-grid.interface';
import { AppTable } from '@app/shared/components/app-table/app-table.interface';
import { UniqueCode } from '@app/shared/validators/unique-code';

@Component({
  selector: 'app-expedientes',
  templateUrl: './expedientes.component.html',
  styleUrls: ['./expedientes.component.scss'],
})
export class ExpedientesComponent extends AbstractDocument implements OnInit {
  fullPath = '/expediente';

  headers: AppTable[] = [
    { field: 'id', label: 'id', visible: false },
    { field: 'codigo', label: 'codigo', filter: true },
    { field: 'nombre_expediente', label: 'NOMBRE DE EXPEDIENTE', filter: true },
    //{ field: 'numero_expediente', label: 'NUMERO DE EXPEDIENTE', filter: true },
    {field: 'entidad_demandante', label: 'ENTIDAD DEMANDANT', filter: true },
    { field: 'habilitado', label: 'habilitado', type: 'habilitado' },
  ];

  form: UntypedFormGroup = this.fb.group(
    {
      id: [],
      codigo: [{ value: null, disabled: this.isEditMode }, [Validators.required],
      Validators.composeAsync([UniqueCode(this.codeValidator.bind(this))])],
      numero_expediente: [],
      nombre_expediente: ['', [Validators.required]],
      entidad_demandante: ['', [Validators.required]],
      fecha_convenio: [],
      numero_resolucion: ['', [Validators.required]],
      detalle: [],
      habilitado: [true],
    },
  );

  headers_detalle: AppTableGrid[] = [
    { field: 'id', label: 'id', visible: false },
    { field: 'codigo', label: 'codigo'},
    { field: 'nombre', label: 'nombre'},
    { field: 'descripcion', label: 'descripcion'},
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
    const fieldName = 'detalle';
    if (e !== null) {
      const f = this.form.get([fieldName]) as UntypedFormArray;
      f.patchValue(e);
    }
  }
}
