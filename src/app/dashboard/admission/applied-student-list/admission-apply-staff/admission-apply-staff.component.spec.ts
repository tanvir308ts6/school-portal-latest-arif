import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionApplyStaffComponent } from './admission-apply-staff.component';

describe('AdmissionApplyStaffComponent', () => {
  let component: AdmissionApplyStaffComponent;
  let fixture: ComponentFixture<AdmissionApplyStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmissionApplyStaffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmissionApplyStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
