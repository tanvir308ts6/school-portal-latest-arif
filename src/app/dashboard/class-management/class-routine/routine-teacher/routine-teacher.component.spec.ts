import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutineTeacherComponent } from './routine-teacher.component';

describe('RoutineTeacherComponent', () => {
  let component: RoutineTeacherComponent;
  let fixture: ComponentFixture<RoutineTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoutineTeacherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutineTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
