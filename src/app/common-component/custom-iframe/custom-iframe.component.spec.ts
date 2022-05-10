import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomIframeComponent } from './custom-iframe.component';

describe('CustomIframeComponent', () => {
  let component: CustomIframeComponent;
  let fixture: ComponentFixture<CustomIframeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomIframeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
