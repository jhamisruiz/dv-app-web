import { LocalStoreService } from './local-store.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of } from 'rxjs';
import { STOREKEY } from '@app/config/keys.config';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {

  private getComponents = new BehaviorSubject<any[] | null>(null);
  getComponents$ = this.getComponents.asObservable();

  constructor(
    private http: HttpClient,
    private persistence: LocalStoreService,
  ) { }

  setComponents(data: any[]): void {
    this.getComponents.next(data);
  }

  getMenu(): Observable<any> {
    const user_id = this.persistence.get(STOREKEY.USER_ID);
    return this.http.get(`modulo-componente?userid=${user_id}&start=1&length=10&search=&order=asc`);
  }

  getUpdate(): Observable<boolean> {
    const d = true;
    return of(d).pipe(delay(1));
  }

  //NOTE: DELETE: este
  saveEmpresaSucursal(d: any): Observable<any> {
    return this.http.post(`usuario-empresa-sucursal`, d);
  }

  menuGlobal(): Observable<any[]> {
    const images: any[] = [
      {
        name: 'Camisa',
        price: 25,
        image: 'https://example.com/shirt.jpg',
      },
      {
        name: 'Pantalón',
        price: 35,
        image: 'https://example.com/pants.jpg',
      },
    ];

    return of(images);
  }
}
