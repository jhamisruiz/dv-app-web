import { createSelector } from '@ngrx/store';
import { AppStateStore } from '../../app.state';
import { AppTableState } from '@store/app-store.interface';

export const selectDataFeature = (state: AppStateStore): any => state.dataTable;

export const selectListDataTable = createSelector(
  selectDataFeature,
  (state: AppTableState) => state.dataTable,
);

export const selectLoadingDataTable = createSelector(
  selectDataFeature,
  (state: AppTableState): boolean => state.loading,
);
