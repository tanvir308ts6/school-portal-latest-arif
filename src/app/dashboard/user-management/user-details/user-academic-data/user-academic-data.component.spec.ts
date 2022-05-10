import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAcademicDataComponent } from './user-academic-data.component';

describe('UserAcademicDataComponent', () => {
  let component: UserAcademicDataComponent;
  let fixture: ComponentFixture<UserAcademicDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAcademicDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAcademicDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
