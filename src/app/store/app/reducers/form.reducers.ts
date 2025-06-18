import { AppFormSaveState } from '../../app-store.interface';
import { createReducer, on } from '@ngrx/store';
import { loadFormSaveAction, loadedFormSaveAction } from '../actions/app.actions';

export const initialState: AppFormSaveState = { loading: false, form: null };

export const appFormSaveReducer = createReducer(
  initialState,
  on(loadFormSaveAction, (state) => {
    return { ...state, loading: true };//cambiar estado a true
  }),
  on(loadedFormSaveAction, (state, { form }) => {
    return { ...state, loading: false, form };
  }),
);
