import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderContactAboutComponent } from './slider-contact-about.component';

describe('SliderContactAboutComponent', () => {
  let component: SliderContactAboutComponent;
  let fixture: ComponentFixture<SliderContactAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SliderContactAboutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderContactAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
