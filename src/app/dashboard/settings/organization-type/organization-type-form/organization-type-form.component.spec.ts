import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationTypeFormComponent } from './organization-type-form.component';

describe('OrganizationTypeFormComponent', () => {
  let component: OrganizationTypeFormComponent;
  let fixture: ComponentFixture<OrganizationTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationTypeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
