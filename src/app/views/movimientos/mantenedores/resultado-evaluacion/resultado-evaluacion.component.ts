import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { AbstractDocument } from '@app/shared/common/classes';
import { AppTable } from '@app/shared/components/app-table/app-table.interface';
import { ResultadoEvaluacionService } from './resultado-evaluacion.service';
import { AppTableGrid } from '@app/shared/components/app-table-grid/app-table-grid.interface';
import { isString } from 'lodash';

@Component({
  selector: 'app-resultado-evaluacion',
  templateUrl: './resultado-evaluacion.component.html',
  styleUrls: ['./resultado-evaluacion.component.scss'],
  providers: [ResultadoEvaluacionService],
})
export class ResultadoEvaluacionComponent extends AbstractDocument implements OnInit {
  fullPath = '/evaluacion';
  // fullPath = '/evaluacion-resultado';

  expandedRows = {};

  form: UntypedFormGroup = this.fb.group({
    downloadOption: [1],
    idConvocatoria: [],
    idExpediente: [],
  });

  headers: AppTable[] = [
    {
      field: 'estado',
      label: 'Resultados',
      type: 'button',
      icon: 'bx-show text-white',
      btnClass: 'primary rounded rounded-5 d-flex align-items-center p-1',
      visible: false,
    },
    { field: 'id', label: 'id', visible: false },
    { field: '', label: 'Export', type: 'exports', excel: true },
    { field: 'codigo', label: 'codigo', filter: true },
    { field: 'nombre', label: 'nombre', filter: true },
    { field: 'nombre_convocatoria', label: 'convocatoria', filter: true },
    { field: 'fecha_convocatoria', label: 'fecha convocatoria', filter: true },
    { field: 'codigo_expediente', label: 'Cod. expediente', filter: true },
    { field: 'numero_expediente', label: 'nro. expediente', visible: false },
    { field: 'postulaciones', label: 'postulaciones' },
  ];

  dialogVisible: boolean = false;

  headers_evaluacion: any[] = [
    { field: 'ruc', label: 'RUC' },
    { field: 'empresa_razon_social', label: 'Empresa' },
    { field: 'descalificado', label: 'Calificado', isTag: true, qualifiedLabel: 'En Evaluación', unqualifiedLabel: 'Descalificado' },
    { field: 'codigo_expediente', label: 'Cod. expediente' },
    /* { field: 'numero_expediente', label: 'nro. expediente', visible: false }, */
    { field: 'evaluacion_documentaria', label: 'Evaluación doc.', customClass: 'text-wrap',  qualifiedLabel: 'CUMPLE', unqualifiedLabel: 'NO CUMPLE' },
    { field: 'muestra_fisica', label: 'E. de Muestras', customClass: 'text-wrap',  qualifiedLabel: 'CUMPLE', unqualifiedLabel: 'NO CUMPLE' },
    { field: 'certificado_calidad', label: 'E. de cumplimiento técnico', customClass: 'text-wrap',  qualifiedLabel: 'CUMPLE', unqualifiedLabel: 'NO CUMPLE' },
    { field: 'plazo_entrega', label: 'Plazo de entrega', customClass: 'text-wrap' },
    { field: 'stock_materia_prima', label: 'Stock M Prima', customClass: 'text-wrap' },
    { field: 'capacidad_maquinaria', label: 'Capacidad de maquinaria', customClass: 'text-wrap' },
    { field: 'experiencia_bienes_igual_similar', label: 'Experiencia', customClass: 'text-wrap' },
    { field: 'precio_ofertado', label: 'Precio O.', customClass: 'text-wrap' },
    { field: 'puntaje_pi', label: 'Puntaje (PI)', customClass: 'text-wrap' },
    { field: 'puntaje_total', label: 'P. Total', customClass: 'text-wrap' },
  ];

  headers_obs: AppTableGrid[] = [
    { field: 'comentario_documentaria', label: 'Evaluación Documentaria' },
    { field: 'comentario_m_cert_calidad', label: 'Evaluacion de muestra certificado de calidad' },
    { field: 'comentario_muestra_fisica', label: 'Evaluacion de muestra física' },
    { field: 'comentario_plazo_entrega', label: 'Plazo de entrega' },
    { field: 'comentario_stock_m_prima', label: 'Stock de materia prima' },
    { field: 'comentario_c_maquinaria', label: 'Capacidad de maquinaria' },
    { field: 'comentario_e_igual_similar', label: 'Experiencia igual o similar' },
    { field: 'comentario_precio_ofertado', label: 'Precio ofertado' },
  ];

  results: any[] = [];
  dialogTitle: string = '';
  downloadOptions: any[] = [
    { label: 'Todo', value: 1 },
    { label: 'Evaluacion Documentaria', value: 2 },
    { label: 'Evaluacion Técnica', value: 3 },
  ];

  constructor(injector: Injector, private service: ResultadoEvaluacionService) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  onViewResults(e: any): void {
    const id = e?.id;
    this.dialogTitle = e.nombre;
    this.dialogVisible = true;
    this.service.getResultsfromEvaluation(id).subscribe(rs => {
      this.results = rs;
    });
  }

  hideDialog(): void {
    this.results = [];
  }

  openExcelInNewTab(e: any): void {
    const id = e?.id;
    this.service.getResultsExcel(id).subscribe(data => {
      this.getFileBase64(data);
    });
  }

  getSeverity(value: any, qualifiedLabel: string, unqualifiedLabel: string): string {
    let v = '';
    if (isString(value)) {
      v = value;
    } else {
      v = value ? unqualifiedLabel : qualifiedLabel;
    }

    switch (v) {
      case qualifiedLabel:
        return 'success';
      case unqualifiedLabel:
        return 'danger';
      default:
        return 'warning';
    }
  }

  getTagValue(value: any, qualifiedLabel: string, unqualifiedLabel: string): string {
    let v = '';
    if (isString(value)) {
      v = value;
    } else {
      v = value ? unqualifiedLabel : qualifiedLabel;
    }

    return v;
  }

  getFileBase64(response: any): void {
    if (response?.data) {
      const base64String = response?.data;
      const binaryString = window.atob(base64String);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);

      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response?.nombre;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  }

  onExportData(): void {
    const { downloadOption, idConvocatoria, idExpediente } = this.form.value;
    this.service.exportData(downloadOption, idConvocatoria, idExpediente).subscribe(rsp => {
      this.getFileBase64(rsp);
    });
  }
}
