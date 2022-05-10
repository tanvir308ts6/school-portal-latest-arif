import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferedSectionFormComponent } from './offered-section-form.component';

describe('OfferedSectionFormComponent', () => {
  let component: OfferedSectionFormComponent;
  let fixture: ComponentFixture<OfferedSectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferedSectionFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferedSectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
