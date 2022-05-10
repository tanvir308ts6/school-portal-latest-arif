import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackberMessageComponent } from './snackber-message.component';

describe('SnackberMessageComponent', () => {
  let component: SnackberMessageComponent;
  let fixture: ComponentFixture<SnackberMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnackberMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackberMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
