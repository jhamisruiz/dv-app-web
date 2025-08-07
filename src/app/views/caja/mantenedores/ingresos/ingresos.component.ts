import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { AppTable } from '@app/shared/components/app-table/app-table.interface';
import { AbstractDocument } from '@common/classes';

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrl: './ingresos.component.scss'
})
export class IngresosComponent extends AbstractDocument implements OnInit {
  fullPath = '/ingresos';
  data: any[] = [];

  headers: AppTable[] = [{ field: 'id', label: 'id', visible: false },
  { field: 'fecha', label: 'fecha' },
  { field: 'comprobante', label: 'comprobante' },
  { field: 'serie', label: 'serie' },
  { field: 'concepto', label: 'concepto' },
  { field: 'moneda', label: 'moneda' },
  { field: 'importe', label: 'importe', type: 'number', prefix: 'S/' },
  { field: 'descripcion', label: 'descripcion' },
  { field: 'fecha_creacion', label: 'fecha_creacion' },
  ];

  form: UntypedFormGroup = this.fb.group(
    {
      id: [],
      fecha: [{ value: new Date(), disabled: this.isEditMode }, [Validators.required]],
      comprobante: ['', []],
      serie: ['', []],
      concepto: ['', [Validators.required]],
      id_usuario: [this.idusuario, [Validators.required]],
      moneda : ['SOLES', [Validators.required]],
      importe: [0, [Validators.required]],
      descripcion: [],
      fecha_creacion: [new Date().toISOString().slice(0, 10)],
      habilitado: [true],
    },
  );

  constructor(injector: Injector) { super(injector); }

  ngOnInit(): void {
    super.ngOnInit();
  }

}
