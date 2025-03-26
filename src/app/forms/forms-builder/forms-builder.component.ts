// src/app/forms/form-builder/form-builder.component.ts
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Store } from '@ngrx/store';
import { FieldType, FormField, FormTemplate } from '../../core/form.model';
import { addForm, saveForm } from '../../store/form.actions';
import { AppState } from '../../store/form.reducer';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-form-builder',
  templateUrl: './forms-builder.component.html',
  styleUrls: ['./forms-builder.component.scss'],
})
export class FormsBuilderComponent implements OnInit {
  form: FormGroup;
  isSubmitting = false;
  fieldTypes = Object.values(FieldType);
  selectedFieldIndex: number | null = null;
  FieldType = FieldType; // Expose to template
  isEditMode = false;
  currentFormId: string | null = null;
  private destroyed$ = new Subject<void>();
  sidebarOpen = false;
  propertiesPanelOpen = false;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      fields: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { form: FormTemplate };

    if (state?.form) {
      this.isEditMode = true;
      this.currentFormId = state.form.id;
      this.loadFormForEditing(state.form);
    }
  }

  private loadFormForEditing(formTemplate: FormTemplate): void {
    this.form.patchValue({
      title: formTemplate.title,
    });

    // Clear existing fields
    while (this.fields.length) {
      this.fields.removeAt(0);
    }

    // Add fields from the template
    formTemplate.fields.forEach((field) => {
      this.addFieldForEditing(field);
    });
  }

  private addFieldForEditing(field: FormField): void {
    const fieldGroup = this.fb.group({
      id: [field.id],
      type: [field.type],
      label: [field.label, Validators.required],
      required: [field.required || false],
      placeholder: [field.placeholder || ''],
      helpText: [field.helpText || ''],
      options: this.fb.array(
        field.options?.map((opt) => this.fb.control(opt)) || []
      ),
      validation: this.fb.group({
        minLength: [field.validation?.minLength || null],
        maxLength: [field.validation?.maxLength || null],
        pattern: [field.validation?.pattern || null],
      }),
    });

    this.fields.push(fieldGroup);
  }

  get fields(): FormArray {
    return this.form.get('fields') as FormArray;
  }

  get fieldsArray(): FormArray {
    return this.form.get('fields') as FormArray;
  }

  getFieldGroup(index: number): FormGroup {
    return this.fieldsArray.at(index) as FormGroup;
  }

  getOptionsArray(index: number): FormArray {
    return this.getFieldGroup(index).get('options') as FormArray;
  }

  addField(type: FieldType): void {
    const fieldGroup = this.fb.group({
      id: [this.generateId()],
      type: [type],
      label: ['New Field', Validators.required],
      required: [false],
      placeholder: [''],
      helpText: [''],
      options: this.fb.array(
        this.needsOptions(type) ? [this.fb.control('Option 1')] : []
      ),
      validation: this.fb.group({
        minLength: [null],
        maxLength: [null],
        pattern: [null],
      }),
    });

    this.fieldsArray.push(fieldGroup);
    this.selectedFieldIndex = this.fieldsArray.length - 1;
  }

  selectField(index: number): void {
    this.selectedFieldIndex = index;
    if (window.innerWidth < 1024) {
      this.propertiesPanelOpen = true;
      this.sidebarOpen = false;
    }
  }

  onDrop(event: CdkDragDrop<FormField[]>): void {
    moveItemInArray(
      this.fieldsArray.controls,
      event.previousIndex,
      event.currentIndex
    );
    this.fieldsArray.updateValueAndValidity();
    this.selectedFieldIndex = event.currentIndex;
  }

  addOption(fieldIndex: number): void {
    this.getOptionsArray(fieldIndex).push(this.fb.control('New Option'));
  }

  removeOption(fieldIndex: number, optionIndex: number): void {
    this.getOptionsArray(fieldIndex).removeAt(optionIndex);
  }

  removeField(index: number): void {
    this.fieldsArray.removeAt(index);
    if (this.selectedFieldIndex === index) {
      this.selectedFieldIndex = null;
    } else if (
      this.selectedFieldIndex !== null &&
      this.selectedFieldIndex > index
    ) {
      this.selectedFieldIndex--;
    }
  }

  onSubmit(): void {
    if (this.form.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const formTemplate: FormTemplate = {
        id: this.isEditMode ? this.currentFormId : Date.now().toString(),
        title: this.form.value.title,
        fields: this.form.value.fields,
        created: this.isEditMode ? this.form.value.created : new Date(),
      };

      this.store.dispatch(saveForm({ form: formTemplate }));

      // Create a selector for the form state
      this.store
        .select((state) => state.forms)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (formsState) => {
            if (!formsState.loading && !formsState.error) {
              this.router.navigate(['/forms/list']);
              this.resetForm();
            } else if (formsState.error) {
              this.isSubmitting = false;
              console.error('Save failed:', formsState.error);
              // Show error to user (e.g., using MatSnackBar)
            }
          },
          error: (err) => {
            this.isSubmitting = false;
            console.error('Error:', err);
          },
          complete: () => {
            this.isSubmitting = false;
          },
        });
    }
  }

  private resetForm(): void {
    this.form.reset();
    this.fields.clear();
    this.selectedFieldIndex = null;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private generateId(): string {
    return 'field_' + Math.random().toString(36).substr(2, 9);
  }

  needsOptions(type: FieldType): boolean {
    return [FieldType.SELECT, FieldType.RADIO, FieldType.CHECKBOX].includes(
      type
    );
  }

  getFieldIcon(type: FieldType): string {
    const iconMap = {
      [FieldType.TEXT]: 'short_text',
      [FieldType.TEXTAREA]: 'notes',
      [FieldType.SELECT]: 'arrow_drop_down_circle',
      [FieldType.CHECKBOX]: 'check_box',
      [FieldType.RADIO]: 'radio_button_checked',
      [FieldType.DATE]: 'event',
    };
    return iconMap[type] || 'text_fields';
  }

  getFormControl(fieldIndex: number, controlName: string): FormControl {
    return this.getFieldGroup(fieldIndex).get(controlName) as FormControl;
  }

  // For options array controls
  getOptionControl(fieldIndex: number, optionIndex: number): FormControl {
    return this.getOptionsArray(fieldIndex).at(optionIndex) as FormControl;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    if (this.propertiesPanelOpen && this.sidebarOpen) {
      this.propertiesPanelOpen = false;
    }
  }

  togglePropertiesPanel() {
    this.propertiesPanelOpen = !this.propertiesPanelOpen;
    if (this.sidebarOpen && this.propertiesPanelOpen) {
      this.sidebarOpen = false;
    }
  }
}
