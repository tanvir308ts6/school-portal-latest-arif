import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentCategoryFormComponent } from './content-category-form.component';

describe('ContentCategoryFormComponent', () => {
  let component: ContentCategoryFormComponent;
  let fixture: ComponentFixture<ContentCategoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentCategoryFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentCategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
