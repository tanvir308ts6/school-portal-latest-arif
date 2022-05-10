import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAcademicFormComponent } from './user-academic-form.component';

describe('UserAcademicFormComponent', () => {
  let component: UserAcademicFormComponent;
  let fixture: ComponentFixture<UserAcademicFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAcademicFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAcademicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
