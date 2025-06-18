import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UnspscService {

  constructor(
    private http: HttpClient,
  ) { }


  Segmentos(): Observable<any> {
    return this.http.get<any>(`producto-unspsc-segmentos`);
  }


  getFamilias(c: string): Observable<any> {
    return this.http.get<any>(`producto-unspsc-familias/${c}`);
  }

  getClases(c: string): Observable<any> {
    return this.http.get<any>(`producto-unspsc-clases/${c}`);
  }

  getProductos(c: string | null, d: string | null): Observable<any> {
    return this.http.get<any>(`producto-unspsc-productos?codigo=${c}&descripcion=${d}`);
  }
}
