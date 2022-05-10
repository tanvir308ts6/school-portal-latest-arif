import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextSearchDropdownComponent } from './text-search-dropdown.component';

describe('TextSearchDropdownComponent', () => {
  let component: TextSearchDropdownComponent;
  let fixture: ComponentFixture<TextSearchDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextSearchDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextSearchDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
