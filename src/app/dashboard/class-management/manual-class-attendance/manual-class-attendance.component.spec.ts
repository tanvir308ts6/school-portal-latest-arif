import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualClassAttendanceComponent } from './manual-class-attendance.component';

describe('ManualClassAttendanceComponent', () => {
  let component: ManualClassAttendanceComponent;
  let fixture: ComponentFixture<ManualClassAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualClassAttendanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualClassAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
