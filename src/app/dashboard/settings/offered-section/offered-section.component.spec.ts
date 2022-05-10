import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferedSectionComponent } from './offered-section.component';

describe('OfferedSectionComponent', () => {
  let component: OfferedSectionComponent;
  let fixture: ComponentFixture<OfferedSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferedSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferedSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
