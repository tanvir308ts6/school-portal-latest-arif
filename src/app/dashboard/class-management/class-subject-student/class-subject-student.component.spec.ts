import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSubjectStudentComponent } from './class-subject-student.component';

describe('ClassSubjectStudentComponent', () => {
  let component: ClassSubjectStudentComponent;
  let fixture: ComponentFixture<ClassSubjectStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassSubjectStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassSubjectStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
