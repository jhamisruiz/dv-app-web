import { Injectable } from '@angular/core';


export interface TableSchema {
  noop: string;
}
export interface FinderSchema {
  id: string;
  key: string;
  data: any;
}

@Injectable({
  providedIn: 'root',
})
export class DataBaseService {
  request!: IDBOpenDBRequest;
  connection: 'OPEN' | 'CLOSED' = 'CLOSED';
  store!: IDBDatabase;


  constructor() {

  }

  init(): void {
    // this.nsfinder.add({ id: 1, user_id: 9, label: 'Toyota' });
  }
}
