import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';
import { FormTemplate } from './form.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private forms: FormTemplate[] = [];

  getForms() {
    return of([...this.forms]).pipe(delay(500));
  }

  saveForm(form: FormTemplate) {
    const existingIndex = this.forms.findIndex((f) => f.id === form.id);

    if (existingIndex > -1) {
      // Create a new array with the updated form
      this.forms = [
        ...this.forms.slice(0, existingIndex),
        { ...form }, // Create new object
        ...this.forms.slice(existingIndex + 1),
      ];
    } else {
      this.forms.push({ ...form }); // Create new object
    }

    return of({ ...form }).pipe(delay(500)); // Return new object
  }

  deleteForm(id: string) {
    this.forms = this.forms.filter((f) => f.id !== id);
    return of(true).pipe(delay(500));
  }

  submitForm(data: any) {
    return of({ success: true }).pipe(delay(500));
  }
}
