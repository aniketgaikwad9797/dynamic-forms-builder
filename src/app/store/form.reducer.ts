import { createReducer, on } from '@ngrx/store';
import { FormTemplate } from '../core/form.model';
import * as FormActions from './form.actions';

export interface FormState {
  forms: FormTemplate[];
  loading: boolean;
  error?: any;
}

export const initialState: FormState = {
  forms: [],
  loading: false,
};

export const formReducer = createReducer(
  initialState,
  on(FormActions.loadForms, (state) => ({ ...state, loading: true })),
  on(FormActions.loadFormsSuccess, (state, { forms }) => ({
    ...state,
    forms,
    loading: false,
  })),
  on(FormActions.addForm, (state, { form }) => ({
    ...state,
    forms: [...state.forms, form],
  })),
  on(FormActions.updateForm, (state, { form }) => ({
    ...state,
    forms: state.forms.map((f) => (f.id === form.id ? form : f)),
  })),
  on(FormActions.deleteForm, (state, { id }) => ({
    ...state,
    forms: state.forms.filter((f) => f.id !== id),
  })),
  on(FormActions.saveForm, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(FormActions.saveFormSuccess, (state, { form }) => ({
    ...state,
    loading: false,
    forms: [...state.forms, form],
  })),
  on(FormActions.saveFormFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);

export interface AppState {
  forms: FormState;
}
