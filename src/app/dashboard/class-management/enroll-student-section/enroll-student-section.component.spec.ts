import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollStudentSectionComponent } from './enroll-student-section.component';

describe('EnrollStudentSectionComponent', () => {
  let component: EnrollStudentSectionComponent;
  let fixture: ComponentFixture<EnrollStudentSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrollStudentSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollStudentSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
