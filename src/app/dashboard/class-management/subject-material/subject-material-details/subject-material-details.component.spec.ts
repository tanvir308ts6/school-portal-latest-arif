import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectMaterialDetailsComponent } from './subject-material-details.component';

describe('SubjectMaterialDetailsComponent', () => {
  let component: SubjectMaterialDetailsComponent;
  let fixture: ComponentFixture<SubjectMaterialDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubjectMaterialDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectMaterialDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
