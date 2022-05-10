import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeGovernComponent } from './welcome-govern.component';

describe('WelcomeGovernComponent', () => {
  let component: WelcomeGovernComponent;
  let fixture: ComponentFixture<WelcomeGovernComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WelcomeGovernComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeGovernComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
