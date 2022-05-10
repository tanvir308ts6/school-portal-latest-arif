import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentArchiveFormComponent } from './content-archive-form.component';

describe('ContentArchiveFormComponent', () => {
  let component: ContentArchiveFormComponent;
  let fixture: ComponentFixture<ContentArchiveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentArchiveFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentArchiveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
