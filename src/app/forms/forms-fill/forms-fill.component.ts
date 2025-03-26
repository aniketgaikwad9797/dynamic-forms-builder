import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormTemplate } from '../../core/form.model';
import { ApiService } from '../../core/api.service';
import { AppState } from '../../store/form.reducer';

@Component({
  selector: 'app-form-fill',
  templateUrl: './forms-fill.component.html',
  styleUrls: ['./forms-fill.component.scss'],
})
export class FormsFillComponent implements OnInit {
  formTemplate$!: Observable<FormTemplate>;
  responseForm!: FormGroup;
  submitted = false;
  success = false;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private api: ApiService
  ) {}

  ngOnInit() {
    const formId = this.route.snapshot.paramMap.get('id');
    this.formTemplate$ = this.store.select(
      (state) => state.forms.forms.find((f) => f.id === formId)!
    );

    this.formTemplate$.subscribe((template) => {
      this.responseForm = this.createFormGroup(template);
    });
  }

  createFormGroup(template: FormTemplate): FormGroup {
    const group: Record<string, any> = {};
    template.fields.forEach((field) => {
      const validators = [];
      if (field.required) validators.push(Validators.required);
      if (field.validation) {
        if (field.validation.minLength)
          validators.push(Validators.minLength(field.validation.minLength));
        if (field.validation.maxLength)
          validators.push(Validators.maxLength(field.validation.maxLength));
        if (field.validation.pattern)
          validators.push(Validators.pattern(field.validation.pattern));
      }
      group[field.id] = [null, validators];
    });
    return this.fb.group(group);
  }

  onSubmit() {
    if (this.responseForm.valid) {
      this.api.submitForm(this.responseForm.value).subscribe({
        next: () => {
          this.submitted = true;
          this.success = true;
          this.responseForm.reset();
        },
        error: () => {
          this.submitted = true;
          this.success = false;
        },
      });
    }
  }
}
