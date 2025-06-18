import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppServicesService {

  constructor(
    private http: HttpClient,
  ) { }

  getDniRuc(d: any): Observable<any> {
    return this.http.post<any>(`user-ruc-dni`, d);
  }
}
