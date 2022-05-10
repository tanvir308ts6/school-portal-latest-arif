import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentArchiveComponent } from './content-archive.component';

describe('ContentArchiveComponent', () => {
  let component: ContentArchiveComponent;
  let fixture: ComponentFixture<ContentArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentArchiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
