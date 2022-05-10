import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionalLandingComponent } from './sessional-landing.component';

describe('SessionalLandingComponent', () => {
  let component: SessionalLandingComponent;
  let fixture: ComponentFixture<SessionalLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionalLandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionalLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
