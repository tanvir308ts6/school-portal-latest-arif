import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSubjectTeacherFormComponent } from './class-subject-teacher-form.component';

describe('ClassSubjectTeacherFormComponent', () => {
  let component: ClassSubjectTeacherFormComponent;
  let fixture: ComponentFixture<ClassSubjectTeacherFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassSubjectTeacherFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassSubjectTeacherFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
