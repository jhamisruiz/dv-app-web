import { Injectable } from '@angular/core';
import { PersistenceApiClass } from './http-service/persistence.service';

@Injectable({
  providedIn: 'root',
})
export class LocalStoreService extends PersistenceApiClass {

  constructor() {
    super(localStorage);
  }
}
