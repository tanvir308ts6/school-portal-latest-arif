import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSectionDetailsComponent } from './class-section-details.component';

describe('ClassSectionDetailsComponent', () => {
  let component: ClassSectionDetailsComponent;
  let fixture: ComponentFixture<ClassSectionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassSectionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassSectionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
