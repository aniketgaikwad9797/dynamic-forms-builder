import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { FormsBuilderComponent } from '../forms/forms-builder/forms-builder.component';
import { formReducer } from 'src/app/store/form.reducer';
import { FormEffects } from 'src/app/store/form.effects';
import { FormsListComponent } from './forms-list/forms-list.component';
import { FormsFillComponent } from './forms-fill/forms-fill.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [FormsBuilderComponent, FormsListComponent, FormsFillComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DragDropModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatRadioModule,
    StoreModule.forFeature('forms', formReducer),
    EffectsModule.forFeature([FormEffects]),
    RouterModule.forChild([
      { path: '', component: FormsBuilderComponent },
      { path: 'builder', component: FormsBuilderComponent },
      { path: 'list', component: FormsListComponent },
      { path: 'fill/:id', component: FormsFillComponent },
    ]),
  ],
})
export class FormsModule {}
