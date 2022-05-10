import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferedClassFormComponent } from './offered-class-form.component';

describe('OfferedClassFormComponent', () => {
  let component: OfferedClassFormComponent;
  let fixture: ComponentFixture<OfferedClassFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferedClassFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferedClassFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
