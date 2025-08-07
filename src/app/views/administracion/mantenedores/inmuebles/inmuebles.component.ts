import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { AppTable } from '@app/shared/components/app-table/app-table.interface';
import { AbstractDocument } from '@common/classes';

@Component({
  selector: 'app-inmuebles',
  templateUrl: './inmuebles.component.html',
  styleUrl: './inmuebles.component.scss'
})
export class InmueblesComponent extends AbstractDocument implements OnInit {
  fullPath = '/inmuebles';
  data: any[] = [];

  headers: AppTable[] = [{ field: 'id', label: 'id', visible: false },
  {
    field: 'estado', label: 'estado', data:
      [{ color: 'success', dataKey: 'Disponible' },
      { color: 'danger', dataKey: 'Vendido' },
      { color: 'warning', dataKey: 'Reservado' }
      ],
    type: 'habilitado'
  },
  { field: 'direccion', label: 'direccion' },
  { field: 'moneda', label: 'moneda' },
  { field: 'precio', label: 'precio', type: 'number', prefix: 'S/' },
  { field: 'descripcion', label: 'descripcion' },
  { field: 'fecha_creacion', label: 'fecha_creacion' },
  { field: 'habilitado', label: 'habilitado', type: 'habilitado' },
  ];
  visible = true;
  form: UntypedFormGroup = this.fb.group(
    {
      id: [],
      direccion: ['', [Validators.required]],
      referencia: ['', [Validators.required]],
      ubigeo: ['', [Validators.required]],
      medidas: ['', [Validators.required]],
      orientacion: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      moneda: ['', [Validators.required]],
      servicios: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      descripcion: [],
      fecha_reserva: [''],
      fecha_venta: [''],
      fecha_creacion: [new Date().toISOString().slice(0, 10)],
      habilitado: [true],
      id_usuario: [(this.isCreateMode ? this.idusuario : null), [Validators.required]],
    },
  );

  estados = [{ codigo: 'Disponible', nombre: 'Disponible' }, { codigo: 'Vendido', nombre: 'Vendido' }, { codigo: 'Reservado', nombre: 'Reservado' }];
  constructor(injector: Injector) { super(injector); }

  ngOnInit(): void {
    super.ngOnInit();
  }
  closeDialog() {
    this.visible = false;
  }
}
