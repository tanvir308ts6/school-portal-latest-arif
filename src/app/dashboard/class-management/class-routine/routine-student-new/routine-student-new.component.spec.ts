import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutineStudentNewComponent } from './routine-student-new.component';

describe('RoutineStudentNewComponent', () => {
  let component: RoutineStudentNewComponent;
  let fixture: ComponentFixture<RoutineStudentNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoutineStudentNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutineStudentNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
