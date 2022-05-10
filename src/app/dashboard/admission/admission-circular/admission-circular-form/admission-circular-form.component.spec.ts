import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionCircularFormComponent } from './admission-circular-form.component';

describe('AdmissionCircularFormComponent', () => {
  let component: AdmissionCircularFormComponent;
  let fixture: ComponentFixture<AdmissionCircularFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmissionCircularFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmissionCircularFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
