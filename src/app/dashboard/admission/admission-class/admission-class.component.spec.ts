import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionClassComponent } from './admission-class.component';

describe('AdmissionClassComponent', () => {
  let component: AdmissionClassComponent;
  let fixture: ComponentFixture<AdmissionClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmissionClassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmissionClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
