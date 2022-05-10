import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThanaFormComponent } from './thana-form.component';

describe('ThanaFormComponent', () => {
  let component: ThanaFormComponent;
  let fixture: ComponentFixture<ThanaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThanaFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThanaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
