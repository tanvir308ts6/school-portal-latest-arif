import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoteStudentFormComponent } from './promote-student-form.component';

describe('PromoteStudentFormComponent', () => {
  let component: PromoteStudentFormComponent;
  let fixture: ComponentFixture<PromoteStudentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromoteStudentFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoteStudentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
