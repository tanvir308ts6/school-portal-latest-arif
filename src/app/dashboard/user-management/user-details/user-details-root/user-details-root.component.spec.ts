import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailsRootComponent } from './user-details-root.component';

describe('UserDetailsRootComponent', () => {
  let component: UserDetailsRootComponent;
  let fixture: ComponentFixture<UserDetailsRootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDetailsRootComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailsRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
