import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { FormTemplate } from '../../core/form.model';
import { AppState } from '../../store/form.reducer';
import { loadForms, deleteForm } from '../../store/form.actions';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-forms-list',
  templateUrl: './forms-list.component.html',
  styleUrls: ['./forms-list.component.scss'],
})
export class FormsListComponent implements OnInit {
  forms$!: Observable<FormTemplate[]>;
  isAdmin$ = this.auth.isAdmin;

  constructor(private store: Store<AppState>, public auth: AuthService) {}

  ngOnInit() {
    this.store.dispatch(loadForms());
    this.forms$ = this.store.select((state) => state.forms.forms);
  }

  deleteForm(id: string) {
    this.store.dispatch(deleteForm({ id }));
  }
}
