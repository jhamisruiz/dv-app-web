import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { AbstractDocument } from '@app/shared/common/classes';
import { AppTable } from '@app/shared/components/app-table/app-table.interface';
import { EvaluacionService } from './evaluacion.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppTableGrid } from '@app/shared/components/app-table-grid/app-table-grid.interface';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-evaluacion-documentaria',
  templateUrl: './evaluacion-documentaria.component.html',
  styleUrls: ['./evaluacion-documentaria.component.scss'],
})
export class EvaluacionDocumentariaComponent extends AbstractDocument implements OnInit {
  fullPath = '/evaluacion-documentaria';

  headers: AppTable[] = [
    { field: 'id', label: 'id', visible: false },
    { field: 'codigo', label: 'codigo', filter: true },
    { field: 'nombre', label: 'nombre', filter: true },
    { field: 'nombre_convocatoria', label: 'convocatoria', filter: true },
    { field: 'fecha_convocatoria', label: 'fecha convocatoria', filter: true },
    { field: 'codigo_expediente', label: 'Cod. expediente', filter: true },
    { field: 'numero_expediente', label: 'nro. expediente', visible: false },
    { field: 'postulaciones', label: 'postulaciones' },
    {
      field: 'estado', label: 'Evaluar', type: 'button',
      ifBtnField: 'evaluacion_documentaria',
      ifBtnName: 'Evaluado',
      ifBtnClass: 'secondary',
    },
  ];

  proveedor: number | undefined;

  form: UntypedFormGroup = this.fb.group({
    id: [],
    nombre: [],
    id_evaluacion: [[]],
    Lista_proveedores: [[]],
    habilitado: [true],
  });

  formDocumentaria: UntypedFormGroup = this.fb.group(
    {
      id: [],
      id_evaluacion: [],
      codigo: [],
      comentario: [],
      form_cumplimiento: [],
      documento_pdf: [, [Validators.required]],
      proveedor: [{ value: null, disabled: true }],
      insumo: [{ value: null, disabled: true }],
      id_proveedor: [],
      descalificado: [],
    },
  );
  headers_documentaria: AppTable[] = [
    { field: 'id', label: 'id', visible: false },
    { field: 'documento', label: 'doc solicitado', dataoverlay: true },
    { field: 'descripcion', label: 'descripcion', dataoverlay: true },
    {
      field: 'si_cumple', type: 'checkbox', label: 'Cumple', customClass: 'justify-content-center align-items-center',
      function: (e: any, d: any): void => {
        this.updateCumple(e, d);
      },
    },
    {
      field: 'no_cumple', type: 'checkbox', label: 'No cumple', customClass: 'justify-content-center align-items-center',
      function: (e: any, d: any): void => {
        this.updateNOCumple(e, d);
      },
    },
    {
      field: 'comentario', label: 'Comentario', type: 'inputText',
      function: (e: any, d: any): void => {
        this.onChangeComentario(e, d);
      },
    },
  ];

  headers_evaluacion: AppTableGrid[] = [
    { field: 'id', label: 'id', visible: false },
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
      parentsVals: [
        {
          field: 'empresa_activi_economi_industrial',
          parentField: 'empresa_activi_economi_industrial',
        },
      ],
      required: true,
      unique: true,
    },
    {
      field: 'porcentaje_evaluado',
      label: '% DE EVALUACIÓN',
      disabled: true,
    },
    {
      field: 'descalificado',
      label: 'CALIFICADO/DESCALIFICADO',
      type: 'boolean',
      disabled: true,
    },
    {
      field: 'empresa_activi_economi_industrial',
      label: 'CIIU',
      disabled: true,
    },
  ];

  data_documentaria: any[] = [];

  host = environment.hostPublic;
  pdfUrl!: SafeResourceUrl;
  pdf_view!: string;
  loading = false;
  sms: any;
  Message!: Message[];

  constructor(
    injector: Injector,
    private sv: EvaluacionService,
    private sanitizer: DomSanitizer,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdf_view);
    if (!this.isViewMode) {
      this.Message = [{ severity: 'info', detail: 'Para pasar a Evaluación Técnica se debe evaluar a todos los Proveedores de esta Evaluación' }];
    }
  }

  getById(e: any): void {
    this.proveedor = e?.id_proveedor;
    this.formDocumentaria.patchValue({
      id_evaluacion: e?.id_evaluacion,
      id_proveedor: this.proveedor,
      proveedor: e?.id_proveedor,
      insumo: e?.id_insumo,
    });
    this.loading = true;
    this.sv.getEvaluacionDocumentaria(e?.id_evaluacion ?? 0, this.proveedor as number).subscribe(f => {
      const form = f?.data ?? f;
      if (this.isEditMode) {
        const result: any[] = form?.form_cumplimiento ?? [];
        this.sv.getIetemsDocumentaria().subscribe((r) => {
          const data: any[] = r ?? [];
          data.forEach((v, i) => {
            data[i].si_cumple = null;
            data[i].comentario = null;
            data[i].no_cumple = null;
            const cumple = result.find(objeto => objeto.id === v.id);
            if (cumple) {
              if (cumple.si_cumple === true) {
                data[i].si_cumple = true;
                data[i].no_cumple = false;
              }
              if (cumple.no_cumple === true) {
                data[i].no_cumple = true;
                data[i].si_cumple = false;
              }
              data[i].comentario = cumple.comentario;
            }

          });
          this.data_documentaria = data;
        });
        if (form?.documento_pdf) {
          this.verPdef(form?.documento_pdf);
        }
        this.formDocumentaria.patchValue(form);
      }
      this.loading = false;
    });
  }
  verPdef(file: any): void {
    this.pdf_view = `${this.host + file?.url}`; //+ (this.form.value?.documento_pdf?.nombre ?? 'app_nec.pdf')
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdf_view);
  }

  btnSubmit(): void {
    if (this.proveedor) {
      this.formDocumentaria.patchValue({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        form_cumplimiento: [...this.data_documentaria].map(({ descripcion, documento, habilitado, index, ...resto }) => resto),
      });



      if (this.valida()) {
        this.formDocumentaria.patchValue({
          descalificado: this.descalificar(),
        });
        this.sv
          .putEvaluacion(this.formDocumentaria.value?.id, this.formDocumentaria.value)
          .subscribe({
            next: (data) => {
              if (data?.data) {
                this.formDocumentaria.patchValue(data?.data);
                this.verPdef(data?.data?.documento_pdf);
                this.sms = {
                  sms: data?.message,
                  icon: 'pi-check-circle text-success',
                  date: Date(),
                };
              }
            },
            complete: () => (this.isLoading = false),
          });
      } else {
        this.sms = {
          sms: `Marca todos los Checkbox`,
          validators: this.getIncompleteRequiredControls(this.formDocumentaria),
          icon: 'pi-times-circle text-danger',
          date: Date(),
        };
      }
    }
  }

  valida(): boolean {
    const form: any[] = this.formDocumentaria.value.form_cumplimiento;
    const valido = form.find(b => b.si_cumple === null || b.no_cumple === null);
    return valido ? false : true;
  }

  resetFormulario(): void {
    this.proveedor = undefined;
    this.formDocumentaria.reset();
    this.data_documentaria=[...[]];
  }

  onChangeComentario(e: any, d: any): void {
    this.formDocumentaria.patchValue({ [d.inputTextField]: e });
  }

  updateCumple(e: any, d: any): void {
    const data = this.data_documentaria;
    if (e?.checked === true) {
      const obj_doc = data.find(objeto => objeto.index === d.index);
      if (obj_doc) {
        const formkey = obj_doc.field;
        this.formDocumentaria.patchValue({ [formkey]: true });
        obj_doc.si_cumple = true;
        obj_doc.no_cumple = false;
      }
    }
    if (e?.checked === false) {
      const obj_doc = data.find(objeto => objeto.index === d.index);
      if (obj_doc) {
        const formkey = obj_doc.field;
        this.formDocumentaria.patchValue({ [formkey]: false });
        obj_doc.si_cumple = false;
        obj_doc.no_cumple = true;
      }
    }
  }

  updateNOCumple(e: any, d: any): void {
    const data = this.data_documentaria;
    if (e?.checked === true) {
      const obj_doc = data.find(objeto => objeto.index === d.index);
      if (obj_doc) {
        obj_doc.si_cumple = false;
        obj_doc.no_cumple = true;
        const formkey = obj_doc.field;
        this.formDocumentaria.patchValue({ [formkey]: false });
      }
    }
    if (e?.checked === false) {
      const obj_doc = data.find(objeto => objeto.index === d.index);
      if (obj_doc) {
        obj_doc.si_cumple = true;
        obj_doc.no_cumple = false;
        const formkey = obj_doc.field;
        this.formDocumentaria.patchValue({ [formkey]: true });
      }
    }
  }

  getFile(e: any): void {
    this.formDocumentaria.patchValue({
      documento_pdf: e,
    });
  }

  descalificar(): boolean | null {
    const form: any[] = this.formDocumentaria.value.form_cumplimiento;
    const valido = form.find(b => b.si_cumple === false && b.no_cumple === true);
    return valido ? true : null;
  }
}
