import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentCategoryComponent } from './content-category.component';

describe('ContentCategoryComponent', () => {
  let component: ContentCategoryComponent;
  let fixture: ComponentFixture<ContentCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
