import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentBulkFormComponent } from './student-bulk-form.component';

describe('StudentBulkFormComponent', () => {
  let component: StudentBulkFormComponent;
  let fixture: ComponentFixture<StudentBulkFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentBulkFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentBulkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
