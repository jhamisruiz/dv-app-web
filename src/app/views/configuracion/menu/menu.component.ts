import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup, Validators } from '@angular/forms';
import { AbstractDocument } from '@app/shared/common/classes';
import { AppTableGrid } from '@app/shared/components/app-table-grid/app-table-grid.interface';
import { AppTable } from '@app/shared/components/app-table/app-table.interface';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})

export class MenuComponent extends AbstractDocument implements OnInit {
  fullPath = '/menu';
  headers: AppTable[] = [
    { field: 'id', label: 'id', visible: false },
    { field: 'nombre', label: 'nombre', filter: true },
    { field: 'url', label: 'url', localUrl: true, filter: true },
    { field: 'orden', label: 'orden' },
    { field: 'habilitado', label: 'habilitado', type: 'habilitado' },
  ];

  form: UntypedFormGroup = this.fb.group(
    {
      id: [],
      nombre: [, [Validators.required]],
      url: [, [Validators.required]],
      icon: [, [Validators.required]],
      class: [, [Validators.required]],
      style: [, [Validators.required]],
      orden: [, [Validators.required]],
      habilitado: [true],
      componentes: [[]],
    },
  );

  headers_comp: AppTableGrid[] = [
    { field: 'id', label: 'id', visible: false },
    { field: 'nombre', label: 'nombre', type: 'text' },
    { field: 'url', label: 'url' },
    { field: 'icon', label: 'icono' },
    { field: 'style', label: 'style' },
    { field: 'tabla', label: 'tabla' },
    {
      field: 'orden', label: 'orden',
      type: 'number', required: true, unique: true,
      minFractionDigits: 0,
    },
    {
      field: 'habilitado',
      label: 'habilitado',
      value: true,
      visible: false,
    },
  ];
  constructor(injector: Injector) { super(injector); }

  ngOnInit(): void {
    super.ngOnInit();
  }

  updateDataResponse(e: any[]): void {
    const fieldName = 'componentes';
    if (e !== null) {
      const f = this.form.get([fieldName]) as UntypedFormArray;
      f.patchValue(e);
    }
  }

}
