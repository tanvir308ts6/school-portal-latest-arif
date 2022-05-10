import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankConfigurationFormComponent } from './bank-configuration-form.component';

describe('BankConfigurationFormComponent', () => {
  let component: BankConfigurationFormComponent;
  let fixture: ComponentFixture<BankConfigurationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankConfigurationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankConfigurationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
