import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionalSettingsComponent } from './institutional-settings.component';

describe('InstitutionalSettingsComponent', () => {
  let component: InstitutionalSettingsComponent;
  let fixture: ComponentFixture<InstitutionalSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstitutionalSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitutionalSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
