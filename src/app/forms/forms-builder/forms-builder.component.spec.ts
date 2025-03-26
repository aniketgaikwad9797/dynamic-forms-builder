import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormsBuilderComponent } from './forms-builder.component';
import { ReactiveFormsModule, FormArray, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FieldType } from '../../core/form.model';
import { By } from '@angular/platform-browser';

describe('FormBuilderComponent', () => {
  let component: FormsBuilderComponent;
  let fixture: ComponentFixture<FormsBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormsBuilderComponent],
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatRadioModule,
        DragDropModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('title')).toBeDefined();
    expect(component.fields.length).toBe(0);
  });

  it('should add a field to the form', () => {
    component.addField(FieldType.TEXT);
    expect(component.fields.length).toBe(1);
    expect(component.fields.at(0).value.type).toBe(FieldType.TEXT);
  });

  it('should remove a field from the form', () => {
    component.addField(FieldType.TEXT);
    component.addField(FieldType.CHECKBOX);
    expect(component.fields.length).toBe(2);

    component.removeField(0);
    expect(component.fields.length).toBe(1);
    expect(component.fields.at(0).value.type).toBe(FieldType.CHECKBOX);
  });

  it('should select a field for editing', () => {
    component.addField(FieldType.TEXT);
    component.selectField(0);
    expect(component.selectedFieldIndex).toBe(0);
  });

  it('should handle form submission', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();

    // Add a field and set title
    component.addField(FieldType.TEXT);
    component.form.get('title').setValue('Test Form');

    // Trigger submit
    const submitButton = fixture.debugElement.query(
      By.css('button[type="submit"]')
    );
    submitButton.nativeElement.click();
    tick();

    expect(component.onSubmit).toHaveBeenCalled();
    expect(component.form.invalid).toBeFalse();
  }));

  it('should add options to select field', () => {
    component.addField(FieldType.SELECT);
    const fieldIndex = 0;
    const optionsArray = component.getOptionsArray(fieldIndex);

    expect(optionsArray.length).toBe(1);

    component.addOption(fieldIndex);
    expect(optionsArray.length).toBe(2);
  });

  it('should remove options from select field', () => {
    component.addField(FieldType.SELECT);
    const fieldIndex = 0;
    const optionsArray = component.getOptionsArray(fieldIndex);

    component.addOption(fieldIndex);
    expect(optionsArray.length).toBe(2);

    component.removeOption(fieldIndex, 0);
    expect(optionsArray.length).toBe(1);
  });

  it('should return correct field icon', () => {
    expect(component.getFieldIcon(FieldType.TEXT)).toBe('short_text');
    expect(component.getFieldIcon(FieldType.CHECKBOX)).toBe('check_box');
    expect(component.getFieldIcon(FieldType.DATE)).toBe('event');
  });
});
