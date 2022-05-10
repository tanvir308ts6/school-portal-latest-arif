import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThanaComponent } from './thana.component';

describe('ThanaComponent', () => {
  let component: ThanaComponent;
  let fixture: ComponentFixture<ThanaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThanaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
