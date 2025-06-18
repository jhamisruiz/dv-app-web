import { AppUnspscState } from '../../app-store.interface';
import { createReducer, on } from '@ngrx/store';
import { loadUnspscAction, loadedUnspscAction } from '../actions/app.actions';

export const initialState: AppUnspscState = { loading: false, codigo: null };

export const appUnspscReducer = createReducer(
  initialState,
  on(loadUnspscAction, (state) => {
    return { ...state, loading: true };//cambiar estado a true
  }),
  on(loadedUnspscAction, (state, { codigo }) => {
    return { ...state, loading: false, codigo };//cambiar estado a true
  }),
);
