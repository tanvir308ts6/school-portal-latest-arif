import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassRoutineComponent } from './class-routine.component';

describe('ClassRoutineComponent', () => {
  let component: ClassRoutineComponent;
  let fixture: ComponentFixture<ClassRoutineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassRoutineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassRoutineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
