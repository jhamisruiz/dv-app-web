import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppTableGridService {

  private changeState = new BehaviorSubject<boolean>(false);
  changeState$ = this.changeState.asObservable();

  constructor(
    private http: HttpClient,
  ) { }

  getdataSource(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  habilitar(url: string, id: any, d: any): Observable<any> {
    return this.http.patch<any>(`${url}/${id}/${d}`, '');
  }

  delete(url: string): Observable<any> {
    return this.http.delete<any>(`${url}`);
  }
  saveData(url: string, data: any): Observable<any> {
    return this.http.post<any>(`${url}`, data);
  }

  setChangeState(e: boolean): void {
    this.changeState.next(e);
  }

  select(u: string): Observable<any> {
    // if (p) {
    //   const prms = this.params.params(p);
    //   return this.http.get<any>(`${u}?${prms}`);
    // }
    return this.http.get<any>(`${u}`);
  }

  suggest(data: any, u: any): Observable<any> {

    const start = 0;
    const length = 10;
    const search = data ?? '';
    const order = 'asc';
    const params = new HttpParams()
      .set('start', start.toString())
      .set('length', length.toString())
      .set('search', search)
      .set('order', order);
    return this.http.get<any>(`${u}`, { params: params });
  }

}
