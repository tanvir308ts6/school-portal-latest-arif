import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectMaterialFormComponent } from './subject-material-form.component';

describe('SubjectMaterialFormComponent', () => {
  let component: SubjectMaterialFormComponent;
  let fixture: ComponentFixture<SubjectMaterialFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubjectMaterialFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectMaterialFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
