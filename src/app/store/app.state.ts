import { ActionReducerMap } from '@ngrx/store';
import {
  AppCompFormState, AppFormSaveState, AppMenuState, AppPermissionState,
  AppTableState, AppUnspscState,
} from '@store/app-store.interface';
import { appTableReducer } from './app-table/reducers/app-table.reducers';
import { appCompFormReducer } from './app/reducers/app.reducer';
import { appUnspscReducer } from './app/reducers/unspsc.reducers';
import { appMenuReducer, appPermissionReducer } from './app-menu/reducers/app-menu.reducers';
import { appFormSaveReducer } from './app/reducers/form.reducers';

export interface AppStateStore {
  dataTable: AppTableState;
  dataMenu: AppMenuState;
  userPermission: AppPermissionState;
  formMode: AppCompFormState;
  unspsc: AppUnspscState;
  form: AppFormSaveState,
}

export const ROOT_REDUCERS: ActionReducerMap<AppStateStore> = {
  dataTable: appTableReducer,
  dataMenu: appMenuReducer,
  userPermission: appPermissionReducer,
  formMode: appCompFormReducer,
  unspsc: appUnspscReducer,
  form: appFormSaveReducer,
};

