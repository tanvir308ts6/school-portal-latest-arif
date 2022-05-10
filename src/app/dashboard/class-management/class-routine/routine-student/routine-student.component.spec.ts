import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutineStudentComponent } from './routine-student.component';

describe('RoutineStudentComponent', () => {
  let component: RoutineStudentComponent;
  let fixture: ComponentFixture<RoutineStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoutineStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutineStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
