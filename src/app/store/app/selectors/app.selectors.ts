import { createSelector } from '@ngrx/store';
import { AppStateStore } from '../../app.state';
import { AppCompFormState, AppFormSaveState, AppUnspscState } from '@store/app-store.interface';

export const selectFormFeature = (state: AppStateStore): any => state.formMode;
export const selectUnspscFeature = (state: AppStateStore): any => state.unspsc;
export const selectFormSaveFeature = (state: AppStateStore): any => state.form;
export const selectCompForm = createSelector(
  selectFormFeature,
  (state: AppCompFormState) => state.formMode,
);

export const selectLoadingCompForm = createSelector(
  selectFormFeature,
  (state: AppCompFormState): AppCompFormState => state,
);


export const selectUnspscForm = createSelector(
  selectUnspscFeature,
  (state: AppUnspscState) => state.codigo,
);

export const selectLoadingUnspsc = createSelector(
  selectUnspscFeature,
  (state: AppUnspscState): boolean => state.loading,
);


export const selectFormSave = createSelector(
  selectFormSaveFeature,
  (state: AppFormSaveState) => state.form,
);

export const selectLoadingFormSave = createSelector(
  selectFormSaveFeature,
  (state: AppFormSaveState): boolean => state.loading,
);
