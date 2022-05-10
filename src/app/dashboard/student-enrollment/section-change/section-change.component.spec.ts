import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionChangeComponent } from './section-change.component';

describe('SectionChangeComponent', () => {
  let component: SectionChangeComponent;
  let fixture: ComponentFixture<SectionChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionChangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
