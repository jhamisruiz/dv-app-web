
import { EMPTY } from 'rxjs';
import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { MenuTypes } from '@store/app.descriptions';
import { AppConfigService } from '@app/shared/services/config.service';

@Injectable()
export class MenuEffects {

  loadMenu$ = createEffect(() => this.actions$.pipe(
    ofType(MenuTypes.loadMenu),
    exhaustMap(() => this.sv.getMenu()
      .pipe(map((dataMenu) => ({ type: MenuTypes.loadedMenu, dataMenu })),
        catchError(() => EMPTY)),
    ),
  ),
  );
  constructor(
    private actions$: Actions<Action>,
    private sv: AppConfigService,
  ) { }
}
