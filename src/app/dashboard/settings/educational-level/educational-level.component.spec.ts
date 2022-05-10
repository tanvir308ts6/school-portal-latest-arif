import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationalLevelComponent } from './educational-level.component';

describe('EducationalLevelComponent', () => {
  let component: EducationalLevelComponent;
  let fixture: ComponentFixture<EducationalLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducationalLevelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationalLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
