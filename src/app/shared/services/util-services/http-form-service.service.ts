import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DATAHANDLER_API_PATH } from '@app/shared/common/constants';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpFormServiceService {

  constructor(private http: HttpClient) { }

  create(endpoint: string, data: any): Observable<any> {
    return this.http.post(endpoint, data);
  }

  replace(endpoint: string, id: any, data: any): Observable<any> {
    return this.http.put(`${endpoint}/${id}`, data);
  }

  update(endpoint: string, id: any, data: any): Observable<any> {
    return this.http.patch(`${endpoint}/${id}`, data);
  }

  delete(endpoint: string, id: any): Observable<any> {
    return this.http.delete(`${endpoint}/${id}`);
  }

  load(endpoint: string, data?: any): Observable<any> {
    return this.http.get(endpoint, { params: data })
      .pipe(
        delay(100),
      );
  }

  dataHandler(data: any): Observable<any> {
    return this.http.get(DATAHANDLER_API_PATH, { params: data });
  }
}
