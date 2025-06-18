import { AppMenuState, AppPermissionState } from '@store/app-store.interface';
import { createSelector } from '@ngrx/store';
import { AppStateStore } from '../../app.state';

export const selectMenuFeature = (state: AppStateStore): any => state.dataMenu;

export const selectListMenu = createSelector(
  selectMenuFeature,
  (state: AppMenuState) => state.dataMenu,
);

export const selectMenuLoading = createSelector(
  selectMenuFeature,
  (state: AppMenuState): boolean => state.loading,
);


export const selectPermissionFeature = (state: AppStateStore): any => state.userPermission;

export const selectPermission = createSelector(
  selectPermissionFeature,
  (state: AppPermissionState) => state.userPermission,
);
