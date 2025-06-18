
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStateStore } from '@store/app.state';
import { Observable } from 'rxjs';
import { selectListMenu } from '@app/store/app-menu/selectors/app-menu.selectors';
import { loadedPermisosAction } from '@app/store/app-menu/actions/app-menu.actions';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  constructor(
    private store: Store<AppStateStore>,
  ) {
  }

  getModulos(): Observable<any[]> {
    return this.store.select(selectListMenu);
  }

  getComponentes(arr: any[], url: string): any[] {
    const modulo = arr.find(obj => obj.url === url);

    return modulo?.componentes ?? [];
  }

  setComponentPermission(componentes: any[], url: string): void {
    const componente = componentes.find(obj => obj.url === url);
    this.store.dispatch(loadedPermisosAction({
      userPermission: {
        user_create: componente?.user_create ?? false,
        user_read: componente?.user_read ?? false,
        user_update: componente?.user_update ?? false,
        user_delete: componente?.user_delete ?? false,
      },
    }));
  }
}
