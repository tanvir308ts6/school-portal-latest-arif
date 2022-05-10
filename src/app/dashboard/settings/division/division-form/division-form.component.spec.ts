import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionFormComponent } from './division-form.component';

describe('DivisionFormComponent', () => {
  let component: DivisionFormComponent;
  let fixture: ComponentFixture<DivisionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DivisionFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
