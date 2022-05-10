import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentArchiveDetailsComponent } from './content-archive-details.component';

describe('ContentArchiveDetailsComponent', () => {
  let component: ContentArchiveDetailsComponent;
  let fixture: ComponentFixture<ContentArchiveDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentArchiveDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentArchiveDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
