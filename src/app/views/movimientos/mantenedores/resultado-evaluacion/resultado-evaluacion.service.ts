import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable()
export class ResultadoEvaluacionService {
  constructor(private http: HttpClient) { }

  getResultsfromEvaluation(idEvaluacion: number): Observable<any> {
    return this.http.get<any>(`/evaluacion-resultado/${idEvaluacion}`);
  }
  getResultsExcel(idEvaluacion: number): Observable<any> {
    return this.http.get<any>(`/evaluacion-docs-exports/${idEvaluacion}`);
  }

  exportData(downloadOption: number, idConvocatoria?: number, idExpediente?: number): Observable<any> {
    console.log(`exportData ->
      downloadOption: ${downloadOption}
      idConvocatoria: ${idConvocatoria}
      idExpediente: ${idExpediente}
    `);

    const params = new HttpParams()
      .set('downloadOption', downloadOption.toString())
      .set('idConvocatoria', (idConvocatoria || '').toString())
      .set('idExpediente', (idExpediente || '').toString());

    // FIXME: corregir ruta real de descarga
    return this.http.get<any>('/resultado-evaluacion-exports', { params: params });
  }
}
