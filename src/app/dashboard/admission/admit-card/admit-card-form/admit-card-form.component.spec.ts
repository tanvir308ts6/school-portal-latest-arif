import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmitCardFormComponent } from './admit-card-form.component';

describe('AdmitCardFormComponent', () => {
  let component: AdmitCardFormComponent;
  let fixture: ComponentFixture<AdmitCardFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmitCardFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmitCardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
