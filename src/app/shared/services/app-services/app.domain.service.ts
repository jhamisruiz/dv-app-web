import { Injectable } from '@angular/core';
import { STOREKEY } from '@app/config/keys.config';
import { LocalStoreService } from '@services/local-store.service';

@Injectable({
  providedIn: 'root',
})
export class DomainService {

  constructor(private localStoreService: LocalStoreService) { }

  getDomain(): string {
    const dominio = this.localStoreService.get(STOREKEY.DOMINIO_EMPRESA);
    return dominio || '';

  }
}
