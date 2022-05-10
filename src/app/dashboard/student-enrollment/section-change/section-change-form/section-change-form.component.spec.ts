import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionChangeFormComponent } from './section-change-form.component';

describe('SectionChangeFormComponent', () => {
  let component: SectionChangeFormComponent;
  let fixture: ComponentFixture<SectionChangeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionChangeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionChangeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
