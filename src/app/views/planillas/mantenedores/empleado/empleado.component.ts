import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { AbstractDocument } from '@app/shared/common/classes';
import { AppTable } from '@app/shared/components/app-table/app-table.interface';
import { AppServicesService } from '@app/shared/services/app-services/app-services.service';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.scss'],
})

export class EmpleadoComponent extends AbstractDocument implements OnInit {

  fullPath = '/empleado';
  headers: AppTable[] = [
    {
      field: 'dni_ruc',
      label: 'dni / ruc',
      filter: true,
    },
    {
      field: 'nombres',
      label: 'nombres',
      filter: true,
    },
    {
      field: 'apellido_paterno',
      label: 'apellido paterno',
      filter: true,
    },
    {
      field: 'apellido_materno',
      label: 'apellido materno',
      filter: true,
    },
    {
      field: 'idgrupo_empleado',
      label: 'grupo',
      type: 'select',
      data: this.dataGrupo,
      fieldname: 'objidGrupo',
      optionLabel: 'nombre',
      optionValue: 'id',
      dataKey: 'id',
    },
  ];

  form: UntypedFormGroup = this.fb.group({
    id: [],
    dni_ruc: ['', [Validators.required]],
    tipo_documento: [],
    nombres: ['', [Validators.required]],
    apellido_paterno: ['', [Validators.required]],
    apellido_materno: ['', [Validators.required]],
    nombre_completo: ['', [Validators.required]],
    fecha_creacion: [new Date().toISOString().slice(0, 10)],
    habilitado: [true],
    es_planilla: [true, [Validators.required]],
    idgrupo_empleado: ['', [Validators.required]],
    telefono: [],
    direccion: [],
    descripcion: [],
  });


  constructor(
    injector: Injector,
    private sv: AppServicesService,
  ) {
    super(injector);

  }

  ngOnInit(): void {
    super.ngOnInit();
  }


  onInput(e: any): void {
    const v = e?.target?.value;
    if (v?.length === 8 || v?.length === 11) {
      this.sv.getDniRuc({ 'dni_ruc': this.form.value.dni_ruc }).subscribe((r: any) => {
        if (r) {
          this.form.patchValue({
            nombres: r?.nombres ?? r?.viaNombre,
            apellido_paterno: r?.apellidoPaterno,
            apellido_materno: r?.apellidoMaterno,
            nombre_completo: r?.nombre,
            tipo_documento: Number(r?.tipoDocumento ?? 0),
            direccion: r?.direccion,
          });
        }
      });
    }
  }


}
