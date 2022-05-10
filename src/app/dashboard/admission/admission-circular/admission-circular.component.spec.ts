import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionCircularComponent } from './admission-circular.component';

describe('AdmissionCircularComponent', () => {
  let component: AdmissionCircularComponent;
  let fixture: ComponentFixture<AdmissionCircularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmissionCircularComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmissionCircularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
