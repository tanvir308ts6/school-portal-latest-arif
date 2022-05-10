import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollSectionOfferdSectionComponent } from './enroll-section-offerd-section.component';

describe('EnrollSectionOfferdSectionComponent', () => {
  let component: EnrollSectionOfferdSectionComponent;
  let fixture: ComponentFixture<EnrollSectionOfferdSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrollSectionOfferdSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollSectionOfferdSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
