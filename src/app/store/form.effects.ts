import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap } from 'rxjs/operators';
import { ApiService } from '../core/api.service';
import * as FormActions from './form.actions';
import { Router } from '@angular/router';

@Injectable()
export class FormEffects {
  constructor(
    private actions$: Actions,
    private api: ApiService,
    private router: Router
  ) {}

  loadForms$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormActions.loadForms),
      mergeMap(() =>
        this.api.getForms().pipe(
          map((forms) => FormActions.loadFormsSuccess({ forms })),
          catchError(() => of({ type: 'LOAD_FORMS_ERROR' }))
        )
      )
    )
  );

  saveForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormActions.saveForm),
      exhaustMap((action) =>
        this.api.saveForm(action.form).pipe(
          map(() => FormActions.saveFormSuccess({ form: action.form })), // Pass the form here
          catchError((error) => of(FormActions.saveFormFailure({ error })))
        )
      )
    )
  );

  deleteForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormActions.deleteForm),
      mergeMap((action) =>
        this.api.deleteForm(action.id).pipe(
          map(() => FormActions.deleteForm({ id: action.id })),
          catchError(() => of({ type: 'DELETE_FORM_ERROR' }))
        )
      )
    )
  );
}
