import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferedClassDetailsComponent } from './offered-class-details.component';

describe('OfferedClassDetailsComponent', () => {
  let component: OfferedClassDetailsComponent;
  let fixture: ComponentFixture<OfferedClassDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferedClassDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferedClassDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
