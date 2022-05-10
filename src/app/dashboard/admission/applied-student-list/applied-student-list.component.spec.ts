import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppliedStudentListComponent } from './applied-student-list.component';

describe('AppliedStudentListComponent', () => {
  let component: AppliedStudentListComponent;
  let fixture: ComponentFixture<AppliedStudentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppliedStudentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppliedStudentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
