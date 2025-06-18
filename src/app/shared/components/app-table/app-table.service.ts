import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { UpdateParams } from '@app/shared/common/utils';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppTableService {

  private changeState = new BehaviorSubject<boolean>(false);
  changeState$ = this.changeState.asObservable();

  private isRefresh = new BehaviorSubject<boolean>(false);
  isRefresh$ = this.isRefresh.asObservable();

  refreshData = new EventEmitter<any>();

  constructor(
    private http: HttpClient,
  ) { }

  getdataSource(path: string): Observable<any> {
    console.log('path', path);
    const objParams = {
      start: 0,
      length: 10,
      search: '',
      order: 'asc',
    };
    const { url, params } = UpdateParams(path, objParams);
    return this.http.get<any>(url, { params });
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

  setRefresh(enabled: boolean): void {
    this.isRefresh.next(enabled);
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
  get(path: string): Observable<any> {

    return this.http.get<any>(path);
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
