import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionalLayoutComponent } from './institutional-layout.component';

describe('InstitutionalLayoutComponent', () => {
  let component: InstitutionalLayoutComponent;
  let fixture: ComponentFixture<InstitutionalLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstitutionalLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitutionalLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
