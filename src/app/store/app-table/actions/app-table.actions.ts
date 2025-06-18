import { createAction, props } from '@ngrx/store';
import { TableTypes } from '@store/app.descriptions';


export const loadTAbleAction = createAction(
  TableTypes.loadTable,
);
export const loadedTAbleAction = createAction(
  TableTypes.loadedTAble,
  props<{ dataTable: any[] }>(),
);
