import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveElegibleStudentComponent } from './approve-elegible-student.component';

describe('ApproveElegibleStudentComponent', () => {
  let component: ApproveElegibleStudentComponent;
  let fixture: ComponentFixture<ApproveElegibleStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveElegibleStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveElegibleStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
