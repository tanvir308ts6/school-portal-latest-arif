import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmitStudentComponent } from './admit-student.component';

describe('AdmitStudentComponent', () => {
  let component: AdmitStudentComponent;
  let fixture: ComponentFixture<AdmitStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmitStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmitStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
