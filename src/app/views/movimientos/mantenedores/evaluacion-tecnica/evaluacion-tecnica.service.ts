import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class EvaluacionTecnicaService {


  constructor(private http: HttpClient) { }

  getEvaluacion(id: number): Observable<any> {

    return this.http.get<any>(`/evaluacion-tecnica/${id}`);
  }

  putEvaluacion(id: number, data: any): Observable<any> {

    return this.http.put<any>(`/evaluacion-tecnica/${id}`,data);
  }

}
