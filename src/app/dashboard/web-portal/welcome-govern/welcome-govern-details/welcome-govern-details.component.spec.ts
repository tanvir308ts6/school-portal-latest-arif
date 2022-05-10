import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeGovernDetailsComponent } from './welcome-govern-details.component';

describe('WelcomeGovernDetailsComponent', () => {
  let component: WelcomeGovernDetailsComponent;
  let fixture: ComponentFixture<WelcomeGovernDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WelcomeGovernDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeGovernDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
