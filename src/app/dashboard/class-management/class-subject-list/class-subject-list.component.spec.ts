import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSubjectListComponent } from './class-subject-list.component';

describe('ClassSubjectListComponent', () => {
  let component: ClassSubjectListComponent;
  let fixture: ComponentFixture<ClassSubjectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassSubjectListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassSubjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
