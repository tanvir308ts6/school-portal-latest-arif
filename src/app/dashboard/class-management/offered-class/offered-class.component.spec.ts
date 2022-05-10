import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferedClassComponent } from './offered-class.component';

describe('OfferedClassComponent', () => {
  let component: OfferedClassComponent;
  let fixture: ComponentFixture<OfferedClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferedClassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferedClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
