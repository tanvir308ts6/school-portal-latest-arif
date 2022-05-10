import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankConfigurationComponent } from './bank-configuration.component';

describe('BankConfigurationComponent', () => {
  let component: BankConfigurationComponent;
  let fixture: ComponentFixture<BankConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
