import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { AbstractDocument, ProviderFunc } from '@app/shared/common/classes';
import { AppTable } from '@app/shared/components/app-table/app-table.interface';
import { AppServicesService } from '@app/shared/services/app-services/app-services.service';
import { UniqueDoc } from '@app/shared/validators/unique-document';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss'],
  providers: [
    ProviderFunc(EmpresaComponent),
  ],
})

export class EmpresaComponent extends AbstractDocument implements OnInit {
  fullPath = '/empresa';
  headers: AppTable[] = [
    { field: 'id', label: 'id', visible: false },
    { field: 'numero_documento', label: 'numero documento', filter: true },
    { field: 'razon_social', label: 'razon social', filter: true },
    { field: 'nombre_comercial', label: 'nombre comercial', filter: true },
    { field: 'departamento', label: 'departamento', filter: true },
    { field: 'provincia', label: 'provincia', filter: true },
    { field: 'distrito', label: 'distrito', filter: true },
    { field: 'habilitado', label: 'habilitado', type: 'habilitado' },
  ];
  form: UntypedFormGroup = this.fb.group(
    {
      id: [],
      tipo_documento: ['6', [Validators.required]],
      numero_documento: [{ value: null, disabled: this.isEditMode }, [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{11}$/)],
      Validators.composeAsync([UniqueDoc(this.codeValidator.bind(this))])],
      razon_social: ['', [Validators.required]],
      nombre_comercial: ['', [Validators.required]],
      departamento: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
      distrito: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      ubigeo: ['', [Validators.required]],
      //dominio: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9-]+$/)]],
      usuario_emisor: ['', [Validators.required]],
      clave_emisor: ['', [Validators.required]],
      certificado: [],
      clave_certificado: [],
      fecha_creacion: [new Date().toISOString().slice(0, 10)],
      habilitado: [true],
      //logo: [],
    },
  );

  counter = 0;
  image = '';
  constructor(
    injector: Injector,
    private sv: AppServicesService,
  ) {
    super(injector);
    this.onSubmitResponse.subscribe((f: any) => {
      const form = f?.data ?? f;
      if (form.logo?.data) {
        this.image = form.logo?.data;
      }
    });
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  fbgroup(f: any): any {
    return this.fb.group(f);
  }

  getUbigeo(e: any): void {
    this.form.patchValue({
      departamento: e.departamento,
      provincia: e.provincia,
      distrito: e.distrito,
      ubigeo: e.ubigeo,
    });
  }

  onInput(e: any): void {
    if (e?.length === 11) {
      this.sv.getDniRuc({ 'numero_documento': e }).subscribe((r: any) => {
        if (r) {
          this.form.patchValue({
            razon_social: r?.nombre,
            nombre_comercial: r?.viaNombre,
            departamento: r?.departamento,
            provincia: r?.provincia,
            distrito: r?.distrito,
            ubigeo: r?.ubigeo,
            direccion: r?.direccion,
          });
        }
      });
    }
  }

  getFile(e: any): void {
    this.form.patchValue({
      logo: e?.delete ? null : e,
    });

    if (this.form.value.logo?.data) {
      this.image = e.data;
    }

  }

}
