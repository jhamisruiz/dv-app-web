import { createReducer, on } from '@ngrx/store';
import { AppTableState } from '@store/app-store.interface';
import { loadTAbleAction, loadedTAbleAction } from '../actions/app-table.actions';

export const initialState: AppTableState = { loading: false, dataTable: [] };

export const appTableReducer = createReducer(
  initialState,
  on(loadTAbleAction, (state) => {
    return { ...state, loading: true };//cambiar estado a true
  }),
  on(loadedTAbleAction, (state, { dataTable }) => {
    return { ...state, loading: false, dataTable };//cambiar estado a true
  }),
);
