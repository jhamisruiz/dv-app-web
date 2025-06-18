import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AbstractDocument } from '@app/shared/common/classes';
import { AppTableGrid } from '@app/shared/components/app-table-grid/app-table-grid.interface';
import { AppTable } from '@app/shared/components/app-table/app-table.interface';
import { EvaluacionTecnicaService } from '@views/movimientos/mantenedores/evaluacion-tecnica/evaluacion-tecnica.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-evaluacion-tecnica',
  templateUrl: './evaluacion-tecnica.component.html',
  styleUrls: ['./evaluacion-tecnica.component.scss'],
})
export class EvaluacionTecnicaComponent extends AbstractDocument implements OnInit {
  fullPath = '/evaluacion';

  activeInsumoIndex: number = 0;
  activeFabricanteConsumidorIndex: number = 0;

  headers: AppTable[] = [
    { field: 'id', label: 'id', visible: false },
    { field: 'codigo', label: 'codigo', filter: true },
    { field: 'nombre', label: 'nombre', filter: true },
    { field: 'nombre_convocatoria', label: 'convocatoria', filter: true },
    { field: 'fecha_convocatoria', label: 'fecha convocatoria', filter: true },
    { field: 'codigo_expediente', label: 'Cod. expediente', filter: true },
    { field: 'numero_expediente', label: 'nro. expediente', visible: false },
    { field: 'postulaciones', label: 'postulaciones' },
  ];

  isLoading: boolean = false;
  ingredient!: string;

  parents = [
    {
      field: 'empresa_activi_economi_industrial',
      parentField: 'empresa_activi_economi_industrial',
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
      parentsVals: this.parents,
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

  form: UntypedFormGroup = this.fb.group({
    id: [],
    nombre: [],
    Lista_proveedores: [[]],
    habilitado: [true],
  });

  formP: UntypedFormGroup = this.fb.group({
    id: [],
    id_evaluacion: [],
    ///
    step_mcc_mf: this.fb.group({
      evaluacion_mcc: [, [Validators.required]],
      pdf_mcc: [],
      comentario_mcc: [, [Validators.required]],

      // EVALUACIÓN DE MUESTRA FISICA
      evaluacion_mf: [, [Validators.required]],
      pdf_mf: [],
      comentario_mf: [, [Validators.required]],
    }),
    es_insumo_principal: [],
    step_plazos_entrega: this.fb.group({
      evaluacion_pe30: [],
      evaluacion_pe45: [],
      evaluacion_pe60: [],
      evaluacion_pe75: [],
      evaluacion_pe90: [],
      evaluacion_pemas90: [],
      pdf_pe: [],
      comentario_pe: [],
    }),
    step_plazo_entrega_secundario: this.fb.group({
      evaluacion_pe_sec_20: [],
      evaluacion_pe_sec_30: [],
      evaluacion_pe_sec_40: [],
      evaluacion_pe_sec_50: [],
      evaluacion_pe_sec_60: [],
      evaluacion_pe_sec_mas60: [],
      selected_plazo_entrega_sec: [],
      pdf_sec_pe: [],
      comentario_sec_pe: [],
    }),
    es_fabricante: [],
    step_fabricante: this.fb.group({
      evaluacion_smp_100: [],
      evaluacion_smp_50_100: [],
      evaluacion_smp_15_50: [],
      evaluacion_smp_50_0: [],
      pdf_smp: [],
      comentario_smp: [],

      // CAPACIDAD DE MAQUINARIA
      evaluacion_cm: [],
      evaluacion_cm1: [],
      evaluacion_cm2: [],
      pdf_cm: [],
      comentario_cm: [],
    }),
    es_distribuidor: [],
    step_distribuidor: this.fb.group({
      evaluacion_sio_100: [],
      evaluacion_sio_50_100: [],
      evaluacion_sio_15_50: [],
      evaluacion_sio_50_0:[],
      pdf_sio: [],
      comentario_sio: [],

      //CAPACIDAD DE ATENCIÓN
      evaluacion_ca: [],
      evaluacion_ca1: [],
      evaluacion_ca2: [],
      pdf_ca: [],
      comentario_ca: [],
    }),
    step_eis_po: this.fb.group({
      //EXPERIENCIA IGUAL O SIMILAR
      evaluacion_eis: [],
      evaluacion_eis7: [],
      evaluacion_eis5: [],
      pdf_eis: [],
      comentario_eis: [],

      // PRECIO OFERTADO
      evaluacion_po: [],
      evaluacion_po_moneda: ['SOLES'],
      pdf_po: [],
      comentario_po: [],
    }),
    //
    proveedor: [{ value: null, disabled: true }],
    insumo: [{ value: null, disabled: true }],
    id_proveedor: [],
    documento_pdf: [],
    es_ganador: [],
    porcentaje_evaluado: [0],
    descalificado: [],
  });

  et!: any;
  activeStep = 0;

  pdf_view = false;
  pdfUrl!: SafeResourceUrl;

  sms: any;
  mensaje = `Completa los campos requeridos en: `;

  proveedor: number | undefined;
  constructor(injector: Injector, private sanitizer: DomSanitizer, private evservicio: EvaluacionTecnicaService) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  onChangeTabStock(e: any): void {
    const index = e.index;
    this.onChangeFD(e, !index ? 'es_fabricante' : 'es_distribuidor');
  }

  getById(e: any): void {
    this.proveedor = e?.id;
    this.formP.patchValue({
      id_proveedor: e?.id_proveedor,
      proveedor: e?.id_proveedor,
      insumo: e?.id_insumo,
    });

    this.evservicio.getEvaluacion(e?.id).subscribe((data) => {

      this.formP.patchValue(data);

      this.activeStep = 1;
      if (this.formP.get('step_mcc_mf')?.invalid) {
        this.activeStep = 0;
      }
      if (this.activeStep === 1) {
        const esInsumoPrincipal: boolean = data?.es_insumo_principal === null ? true : data?.es_insumo_principal;
        const activeFormName = (esInsumoPrincipal ? 'step_plazos_entrega' : 'step_plazo_entrega_secundario');
        this.clearVAlidators('step_plazos_entrega');
        this.clearVAlidators('step_plazo_entrega_secundario');
        this.validate(activeFormName);

        if (esInsumoPrincipal === false) {
          this.activeInsumoIndex = 1;
          const sec = this.formP.get('step_plazo_entrega_secundario') as UntypedFormGroup;

          Object.keys(data.step_plazo_entrega_secundario).forEach(key => {
            if (key.startsWith('evaluacion_') && data.step_plazo_entrega_secundario[key]) {
              sec.patchValue({ selected_plazo_entrega_sec: key });
              this.activeInsumoIndex = 1;
            }
          });
        }

        this.activeStep = 2;
        if (this.formP.get(activeFormName)?.invalid) {
          this.activeStep = 1;
        }

        if (this.activeStep === 2) {
          if (this.formP.value?.es_fabricante) {
            this.activeStep = 3; /// FIXME: CORREFIR ESTE PASO
            this.validate('step_fabricante');
            this.activeFabricanteConsumidorIndex = 0;
            if (this.formP.get('step_fabricante')?.invalid) {
              this.activeStep = 2;
            }
          }

          if (this.formP.value?.es_distribuidor) {
            this.activeStep = 3;
            this.validate('step_distribuidor');
            this.activeFabricanteConsumidorIndex = 1;
            if (this.formP.get('step_distribuidor')?.invalid) {
              this.activeStep = 2;
            }
          }
          if (
            this.formP.value?.es_fabricante === null &&
            this.formP.value?.es_distribuidor === null
          ) {
            this.validate('step_fabricante');
            this.formP.patchValue({
              es_fabricante: true,
              es_distribuidor: false,
            });
          }

          if (this.activeStep === 3) {
            this.validate('step_eis_po');
          }
        }
      }
    });
  }

  resetFormulario(): void {
    this.proveedor = undefined;
    this.formP.reset();
  }
  //////
  getFile(e: any, fg: string, fc: string): void {
    const fgoup = this.formP.get(fg) as UntypedFormGroup;
    fgoup.patchValue({
      [fc]: e?.delete ? null : e,
    });
  }

  verPDF(fg: string, fc: string): void {
    const pdf_view = 'https://gateway.adminedic.com/public/docs/app.pdf';
    const pdf = this.formP.get(fg)?.value?.[fc];
    console.log('pdf', pdf);
    console.log('https://gateway.adminedic.com/' + pdf?.url);
    if (pdf && pdf?.url) {
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        environment.hostPublic + pdf?.url ?? pdf_view,
      );
      this.pdf_view = true;
    }
  }

  nextStepFD(nx: any): void {
    this.clearVAlidators('step_fabricante');
    this.clearVAlidators('step_distribuidor');
    if (this.formP.value?.es_fabricante === true) {
      this.nextStep(nx, 'step_fabricante', 'FRABRICANTE');
    }
    if (this.formP.value?.es_distribuidor === true) {
      this.nextStep(nx, 'step_distribuidor', 'DISTRIBUIDOR');
    }
    if (
      this.formP.value?.es_fabricante === null &&
      this.formP.value?.es_distribuidor === null
    ) {
      this.sms = {
        sms: this.mensaje + 'FRABRICANTE o DISTRIBUIDOR',
        validators: this.getIncompleteRequiredControls(this.formP.get('step_fabricante'), 'step_fabricante.'),
        date: Date(),
      };
    }
  }

  nextStep(nx: any, fg: string, txt: string): void {
    this.validate(fg);
    if (this.formP.get(fg)?.invalid) {
      this.sms = {
        sms: this.mensaje + txt,
        validators: this.getIncompleteRequiredControls(this.formP.get(fg), `${fg}.`),
        date: Date(),
      };
      return;
    }
    nx.emit();
    if (fg === 'step_plazos_entrega') {
      if (
        this.formP.value?.es_fabricante === null &&
        this.formP.value?.es_distribuidor === null
      ) {
        this.formP.patchValue({ es_fabricante: true });
      }
    }
  }

  btnSubmit(): void {
    if (this.proveedor === undefined) {
      return;
    }
    if (this.formP.value?.descalificado === true && this.formP.value?.es_ganador !== false) {
      this.sms = {
        sms: `Este proveedor esta descalificado no puedes guardar cambios`,
        date: Date(),
      };
      return;
    }
    this.isLoading = true;

    if (this.formP.get('step_mcc_mf')?.invalid) {
      this.sms = {
        sms: this.mensaje + 'EVALUACIÓN DE MUESTRA CERTIFICADO DE CALIDAD',
        validators: this.getIncompleteRequiredControls(this.formP.get('step_mcc_mf'), 'step_mcc_mf.'),
        date: Date(),
      };
      this.isLoading = false;
      return;
    }

    const esInsumoPrincipal: boolean = this.formP.value?.es_insumo_principal;// === null ? true : this.formP.value?.es_insumo_principal;
    if (esInsumoPrincipal != null) {
      const stepSelected = esInsumoPrincipal ? 'step_plazos_entrega' : 'step_plazo_entrega_secundario';
      const stepNotSelected = esInsumoPrincipal ? 'step_plazo_entrega_secundario' : 'step_plazos_entrega';
      this.validate(stepSelected);
      this.clearVAlidators(stepNotSelected);
      const fd = this.formP.get(stepNotSelected) as UntypedFormGroup;
      fd.reset();

      if (this.formP.get(stepSelected)?.invalid) {
        this.sms = {
          sms: this.mensaje + (esInsumoPrincipal ? 'INSUMO PRINCIPAL' : 'INSUMO SECUNDARIO'),
          validators: this.getIncompleteRequiredControls(this.formP.get(stepSelected), `${stepSelected}.`),
          date: Date(),
        };
        this.isLoading = false;
        return;
      }
    }

    if (
      this.formP.value?.es_fabricante === true &&
      this.formP.value?.es_distribuidor === false
    ) {
      this.validate('step_fabricante');
      this.clearVAlidators('step_distribuidor');
      const fd = this.formP.get('step_distribuidor') as UntypedFormGroup;
      fd.reset();

      if (this.formP.get('step_fabricante')?.invalid) {
        this.sms = {
          sms: this.mensaje + 'FRABRICANTE',
          validators: this.getIncompleteRequiredControls(this.formP.get('step_fabricante'), 'step_fabricante.'),
          date: Date(),
        };
        this.isLoading = false;
        return;
      }
    }

    if (
      this.formP.value?.es_distribuidor === true &&
      this.formP.value?.es_fabricante === false
    ) {
      this.validate('step_distribuidor');
      this.clearVAlidators('step_fabricante');
      const sf = this.formP.get('step_fabricante') as UntypedFormGroup;
      sf.reset();

      if (this.formP.get('step_distribuidor')?.invalid) {
        this.sms = {
          sms: this.mensaje + 'DISTRIBUIDOR',
          validators: this.getIncompleteRequiredControls(this.formP.get('step_distribuidor'), 'step_distribuidor.'),
          date: Date(),
        };
        this.isLoading = false;
        return;
      }
    }

    if (this.formP.get('step_eis_po')?.invalid) {
      this.sms = {
        sms: this.mensaje + 'EXPERIENCIA IGUAL O SIMILAR',
        validators: this.getIncompleteRequiredControls(this.formP.get('step_eis_po'), 'step_eis_po.'),
        date: Date(),
      };
      this.isLoading = false;
      return;
    }
    ///GUARDA CAMBIOS
    this.evservicio
      .putEvaluacion(this.formP.value?.id, this.formP.value)
      .subscribe({
        next: (data) => {
          if (data?.data) {
            this.formP.patchValue(data?.data);
            this.sms = {
              sms: data?.message,
              icon: 'pi-check-circle text-success',
              date: Date(),
            };
          }
        },
        complete: () => (this.isLoading = false),
      });
  }

  onChange(fg: string, e: boolean, field: string): void {
    const step_mcc_mf = this.formP.get(fg) as UntypedFormGroup;

    if (step_mcc_mf) {
      if (
        step_mcc_mf.get([field])?.value === null ||
        step_mcc_mf.get([field])?.value === undefined
      ) {
        step_mcc_mf.patchValue({ [field]: e });
        return;
      }
      if (step_mcc_mf.get([field])?.value === true) {
        step_mcc_mf.patchValue({ [field]: false });
        return;
      }
      if (step_mcc_mf.get([field])?.value === false) {
        step_mcc_mf.patchValue({ [field]: true });
      }
    }
  }

  onChangePe(event: any, c: string): void {
    const step_plazos_entrega = this.formP.get(
      'step_plazos_entrega',
    ) as UntypedFormGroup;
    if (step_plazos_entrega) {
      const pt = {
        evaluacion_pe30: false,
        evaluacion_pe45: false,
        evaluacion_pe60: false,
        evaluacion_pe75: false,
        evaluacion_pe90: false,
        evaluacion_pemas90: false,
      };
      step_plazos_entrega.patchValue({ [c]: true });
      Object.keys(pt).forEach((key) => {
        if (key !== c) {
          step_plazos_entrega.patchValue({ [key]: false });
        }
      });
    }
  }

  onChangeFD(e: any, c: string): void {
    const pt = {
      es_fabricante: false,
      es_distribuidor: false,
    };
    this.formP.patchValue({ [c]: true });
    Object.keys(pt).forEach((key) => {
      if (key !== c) {
        this.formP.patchValue({ [key]: false });
      }
    });
  }

  onChangeSMP(e: boolean, c: string): void {
    const fabricante = this.formP.get('step_fabricante') as UntypedFormGroup;
    if (fabricante) {
      const smp = {
        evaluacion_smp_100: false,
        evaluacion_smp_50_100: false,
        evaluacion_smp_15_50: false,
        evaluacion_smp_50_0: false,
      };
      fabricante.patchValue({ [c]: true });
      Object.keys(smp).forEach((key) => {
        if (key !== c) {
          fabricante.patchValue({ [key]: false });
        }
      });
    }
  }

  onChangeSIO(e: boolean, c: string): void {
    const fabricante = this.formP.get('step_distribuidor') as UntypedFormGroup;
    if (fabricante) {
      const smp = {
        evaluacion_sio_100: false,
        evaluacion_sio_50_100: false,
        evaluacion_sio_15_50: false,
        evaluacion_sio_50_0: false,
      };
      fabricante.patchValue({ [c]: true });
      Object.keys(smp).forEach((key) => {
        if (key !== c) {
          fabricante.patchValue({ [key]: false });
        }
      });
    }
  }

  validate(fg: string): void {
    if (fg === 'step_fabricante' || fg === 'step_mcc_mf'){
      return;
    }
    const formGroup = this.formP.get(fg) as UntypedFormGroup;
    // Itera sobre los controles del FormGroup
    Object.keys(formGroup.controls).forEach((controlName) => {
      // Obtén una referencia al control actual
      const control = formGroup.get(controlName);

      if (!controlName.startsWith('pdf')) {
        // Aplica la validación requerida al control
        control?.setValidators(Validators.required);
      }

      control?.updateValueAndValidity();
    });
  }

  clearVAlidators(fg: string): void {
    const formGroup = this.formP.get(fg) as UntypedFormGroup;
    // Itera sobre los controles del FormGroup
    Object.keys(formGroup.controls).forEach((controlName) => {
      // Obtén una referencia al control actual
      const control = formGroup.get(controlName);

      // Aplica la validación requerida al control
      control?.clearValidators();
      control?.updateValueAndValidity();
    });
  }

  onClickEvalSec(e: any, fgName: string, fgReset: string): void {
    const valueSelected = e.value;

    const frmToUpdate = this.formP.get(fgName) as UntypedFormGroup;
    const frmToReset = this.formP.get(fgReset) as UntypedFormGroup;

    Object.keys(frmToUpdate.controls).forEach(controlName => {
      const fgControl = frmToUpdate.get(controlName);
      if (controlName.startsWith('evaluacion_pe')) {
        fgControl?.patchValue(false);
      }

      if (!controlName.startsWith('pdf')) {
        // Aplica la validación requerida al control
        fgControl?.setValidators(Validators.required);
      }
    });
    frmToUpdate.get(valueSelected)?.patchValue(true);

    // Reset & clean validators
    frmToReset.reset();
    Object.keys(frmToUpdate.controls).forEach(controlName => {
      frmToUpdate.get(controlName)?.clearValidators();

    });
  }

  /**
   * Update insumo principal value
   */
  onChangePlazoEntrega(event: any): void {
    const index = event.index;
    this.formP.get('es_insumo_principal')?.patchValue(!index);
  }

  nextEvalMuestraCertCalidad(nextCallback: any): void {
    this.nextStep(nextCallback, 'step_mcc_mf', 'EVALUACIÓN DE MUESTRA CERTIFICADO DE CALIDAD');
    this.validate('step_plazos_entrega');
    this.pdf_view = false;

    this.formP.get('es_insumo_principal')?.patchValue(!this.activeInsumoIndex);
  }

  nextInsumos(nx: any): void {
    this.clearVAlidators('step_plazos_entrega');
    this.clearVAlidators('step_plazo_entrega_secundario');


    const esInsumoPrincipal: boolean = this.formP.value?.es_insumo_principal === null ? true : this.formP.value?.es_insumo_principal;
    const selectedTab = esInsumoPrincipal ? 'INSUMO PRINCIPAL' : 'INSUMO SECUNDARIO';

    this.nextStep(
      nx,
      esInsumoPrincipal ? 'step_plazos_entrega' : 'step_plazo_entrega_secundario',
      selectedTab,
    );
  }

  descalificar(): void {
    const params = [
      'tu',
      // 'evaluacion_mcc',
      // 'evaluacion_mf',
      // 'evaluacion_cm',//NOTE: solo descalifica para el nec TEXTIL O CUERO Y CALZAD
      // 'evaluacion_ca',//NOTE: solo descalifica para el nec TEXTIL O CUERO Y CALZAD
    ];
    if (params) { }
  }
}
