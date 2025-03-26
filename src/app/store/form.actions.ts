import { createAction, props } from '@ngrx/store';
import { FormTemplate } from '../core/form.model';

export const loadForms = createAction('[Form] Load Forms');
export const loadFormsSuccess = createAction(
  '[Form] Load Forms Success',
  props<{ forms: FormTemplate[] }>()
);
export const addForm = createAction(
  '[Form] Add Form',
  props<{ form: FormTemplate }>()
);
export const updateForm = createAction(
  '[Form] Update Form',
  props<{ form: FormTemplate }>()
);
export const deleteForm = createAction(
  '[Form] Delete Form',
  props<{ id: string }>()
);
export const saveForm = createAction(
  '[Form] Save Form',
  props<{ form: FormTemplate }>()
);

export const saveFormSuccess = createAction(
  '[Form] Save Form Success',
  props<{ form: FormTemplate }>()
);

export const saveFormFailure = createAction(
  '[Form] Save Form Failure',
  props<{ error: any }>()
);
