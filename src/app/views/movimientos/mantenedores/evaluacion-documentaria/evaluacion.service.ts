import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EvaluacionService {

  //
  constructor(private http: HttpClient) { }

  getIetemsDocumentaria(): Observable<any[]> {

    return this.http.get<any>(`/evaluacion-cumplimiento-buscar?start=0&length=10&search=&order=asc`);
  }

  getEvaluacionDocumentaria(idEvaluacion: number,idProveedor: number): Observable<any> {
    return this.http.get<any>(`/evaluacion-documentaria-proveedor?idevaluacion=${idEvaluacion}&idproveedor=${idProveedor}`);
  }

  putEvaluacion(id: number, data: any): Observable<any> {

    return this.http.put<any>(`/evaluacion-documentaria/${id}`, data);
  }
}
