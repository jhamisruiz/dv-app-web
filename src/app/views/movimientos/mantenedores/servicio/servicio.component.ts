import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { AbstractDocument } from '@app/shared/common/classes';
import { AppTable } from '@app/shared/components/app-table/app-table.interface';
import { UniqueCode } from '@app/shared/validators/unique-code';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.scss'],
})
export class ServicioComponent extends AbstractDocument implements OnInit {
  fullPath = '/servicio';

  headers: AppTable[] = [
    { field: 'id', label: 'id', visible: false },
    { field: 'codigo', label: 'codigo', filter: true },
    { field: 'nombre', label: 'nombre', filter: true },
    { field: 'descripcion', label: 'descripcion', filter: true },
    { field: 'habilitado', label: 'habilitado', type: 'habilitado' },
  ];

  form: UntypedFormGroup = this.fb.group(
    {
      id: [],
      nombre: ['', [Validators.required]],
      codigo: [{ value: null, disabled: this.isEditMode }, [Validators.required],
      Validators.composeAsync([UniqueCode(this.codeValidator.bind(this))])],
      descripcion: ['', [Validators.required]],
      habilitado: [true],
    },
  );

  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

}
