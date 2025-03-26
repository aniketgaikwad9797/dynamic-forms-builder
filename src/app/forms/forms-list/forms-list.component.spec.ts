import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsListComponent } from '../forms-list/forms-list.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { FormTemplate } from '../../core/form.model';
import { StoreModule } from '@ngrx/store';
import { formReducer } from '../../store/form.reducer';
import { AuthService } from '../../core/auth.service';
import { of } from 'rxjs';

describe('FormListComponent', () => {
  let component: FormsListComponent;
  let fixture: ComponentFixture<FormsListComponent>;
  let authService: AuthService;

  const mockForms: FormTemplate[] = [
    {
      id: '1',
      title: 'Test Form 1',
      fields: [],
      created: new Date(),
    },
    {
      id: '2',
      title: 'Test Form 2',
      fields: [],
      created: new Date(),
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormsListComponent],
      imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        StoreModule.forRoot({ forms: formReducer }),
      ],
      providers: [
        {
          provide: AuthService,
          useValue: {
            currentRole$: of('admin'),
            isAdmin: true,
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsListComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    component.forms$ = of(mockForms);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all forms', () => {
    const formCards = fixture.debugElement.queryAll(By.css('mat-card'));
    expect(formCards.length).toBe(mockForms.length);
  });

  it('should show form titles', () => {
    const firstCardTitle = fixture.debugElement.query(By.css('mat-card-title'));
    expect(firstCardTitle.nativeElement.textContent).toContain('Test Form 1');
  });

  it('should show admin actions for admin users', () => {
    spyOnProperty(authService, 'isAdmin', 'get').and.returnValue(true);
    fixture.detectChanges();

    const adminButtons = fixture.debugElement.queryAll(
      By.css('.admin-actions button')
    );
    expect(adminButtons.length).toBeGreaterThan(0);
  });

  it('should not show admin actions for regular users', () => {
    spyOnProperty(authService, 'isAdmin', 'get').and.returnValue(false);
    fixture.detectChanges();

    const adminButtons = fixture.debugElement.queryAll(
      By.css('.admin-actions')
    );
    expect(adminButtons.length).toBe(0);
  });

  it('should emit delete event when delete button clicked', () => {
    spyOn(component, 'deleteForm');
    spyOnProperty(authService, 'isAdmin', 'get').and.returnValue(true);
    fixture.detectChanges();

    const deleteButton = fixture.debugElement.query(By.css('.delete-button'));
    deleteButton.nativeElement.click();

    expect(component.deleteForm).toHaveBeenCalled();
  });

  it('should display empty state when no forms', () => {
    component.forms$ = of([]);
    fixture.detectChanges();

    const emptyState = fixture.debugElement.query(By.css('.empty-state'));
    expect(emptyState).toBeTruthy();
  });
});
