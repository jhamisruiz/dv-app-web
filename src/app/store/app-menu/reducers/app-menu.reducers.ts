import { createReducer, on } from '@ngrx/store';
import { AppMenuState, AppPermissionState } from '@store/app-store.interface';
import { loadedMenuAction, loadedPermisosAction } from '../actions/app-menu.actions';

export const initialState: AppMenuState = { loading: false, dataMenu: [] };

export const appMenuReducer = createReducer(
  initialState,
  on(loadedMenuAction, (state, { dataMenu }) => {
    return { ...state, dataMenu };
  }),
);

export const initialPermissionState: AppPermissionState = { userPermission: null };

export const appPermissionReducer = createReducer(
  initialPermissionState,
  on(loadedPermisosAction, (state, { userPermission }) => {
    return { ...state, userPermission };
  }),
);
