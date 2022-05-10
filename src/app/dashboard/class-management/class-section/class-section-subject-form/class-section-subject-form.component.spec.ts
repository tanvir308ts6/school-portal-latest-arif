import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSectionSubjectFormComponent } from './class-section-subject-form.component';

describe('ClassSectionSubjectFormComponent', () => {
  let component: ClassSectionSubjectFormComponent;
  let fixture: ComponentFixture<ClassSectionSubjectFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassSectionSubjectFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassSectionSubjectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
