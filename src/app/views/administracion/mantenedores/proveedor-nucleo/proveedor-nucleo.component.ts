import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { AbstractDocument } from '@app/shared/common/classes';
import { AppTable } from '@app/shared/components/app-table/app-table.interface';
import { UniqueCode } from '@app/shared/validators/unique-code';

@Component({
  selector: 'app-proveedor-nucleo',
  templateUrl: './proveedor-nucleo.component.html',
  styleUrls: ['./proveedor-nucleo.component.scss'],
})
export class ProveedorNucleoComponent extends AbstractDocument implements OnInit {
  fullPath = '/proveedor-empresa';

  headers: AppTable[] = [
    { field: 'id', label: 'id', visible: false },
    { field: 'razon_social', label: 'proveedor' },
    { field: 'codigo', label: 'codigo' },
    { field: 'habilitado', label: 'habilitado', type: 'habilitado' },
  ];

  form: UntypedFormGroup = this.fb.group(
    {
      id: [],
      id_proveedor: ['', [Validators.required]],
      codigo: [{ value: null, disabled: this.isEditMode }, [Validators.required],
      Validators.composeAsync([UniqueCode(this.codeValidator.bind(this))])],
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

  fbgroup(f: any): any {
    return this.fb.group(f);
  }

}
