import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { AbstractDocument } from '@app/shared/common/classes';
import { AppTable } from '@app/shared/components/app-table/app-table.interface';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss'],
})
export class CategoriaComponent extends AbstractDocument implements OnInit {
  fullPath = '/categoria';
  data: any[] = [];
  headers: AppTable[] = [{ field: 'id', label: 'id', visible: false },
  { field: 'nombre', label: 'nombre', filter: true },
  { field: 'descripcion', label: 'descripcion', filter: true },
  { field: 'habilitado', label: 'habilitado', type: 'habilitado' },
  ];

  form: UntypedFormGroup = this.fb.group(
    {
      id: [],
      nombre: ['', [Validators.required]],
      descripcion: [],
      fecha_creacion: [new Date().toISOString().slice(0, 10)],
      habilitado: [true],
      detalle: [[]],
    },
  );

  constructor(injector: Injector) { super(injector); }

  ngOnInit(): void {
    super.ngOnInit();
  }

}
