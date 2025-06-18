import { AppCompFormState } from '../../app-store.interface';
import { createReducer, on } from '@ngrx/store';
import { loadCompAction, loadedCompAction } from '../actions/app.actions';

export const initialState: AppCompFormState = { loading: false, formMode: null, id: null };

export const appCompFormReducer = createReducer(
  initialState,
  on(loadCompAction, (state, { formMode, id }) => {
    return { ...state, loading: true, formMode, id };//cambiar estado a true
  }),
  on(loadedCompAction, (state, { formMode, id }) => {
    return { ...state, loading: false, formMode, id };//cambiar estado a true
  }),
);
