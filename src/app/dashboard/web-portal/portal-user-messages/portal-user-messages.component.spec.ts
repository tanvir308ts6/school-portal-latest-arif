import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalUserMessagesComponent } from './portal-user-messages.component';

describe('PortalUserMessagesComponent', () => {
  let component: PortalUserMessagesComponent;
  let fixture: ComponentFixture<PortalUserMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortalUserMessagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalUserMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
