import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiveAttendanceFormComponent } from './give-attendance-form.component';

describe('GiveAttendanceFormComponent', () => {
  let component: GiveAttendanceFormComponent;
  let fixture: ComponentFixture<GiveAttendanceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiveAttendanceFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiveAttendanceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
