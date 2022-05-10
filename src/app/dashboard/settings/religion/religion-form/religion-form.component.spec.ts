import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReligionFormComponent } from './religion-form.component';

describe('ReligionFormComponent', () => {
  let component: ReligionFormComponent;
  let fixture: ComponentFixture<ReligionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReligionFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReligionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
