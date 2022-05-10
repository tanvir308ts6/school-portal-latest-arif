import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationalLevelFormComponent } from './educational-level-form.component';

describe('EducationalLevelFormComponent', () => {
  let component: EducationalLevelFormComponent;
  let fixture: ComponentFixture<EducationalLevelFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducationalLevelFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationalLevelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
