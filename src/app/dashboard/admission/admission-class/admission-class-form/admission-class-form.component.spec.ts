import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionClassFormComponent } from './admission-class-form.component';

describe('AdmissionClassFormComponent', () => {
  let component: AdmissionClassFormComponent;
  let fixture: ComponentFixture<AdmissionClassFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmissionClassFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmissionClassFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
