import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppUbigeoService {

  constructor(
    private http: HttpClient,
  ) { }


  Departamento(): Observable<any> {
    return this.http.get<any>(`ubigeo/departamento`);
  }


  Provincia(s: string): Observable<any> {
    return this.http.get<any>(`ubigeo/provincia/${s}`);
  }

  Distrito(s: string): Observable<any> {
    return this.http.get<any>(`ubigeo/distrito/${s}`);
  }

}
