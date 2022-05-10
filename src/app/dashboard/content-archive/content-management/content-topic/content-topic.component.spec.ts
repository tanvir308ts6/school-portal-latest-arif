import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentTopicComponent } from './content-topic.component';

describe('ContentTopicComponent', () => {
  let component: ContentTopicComponent;
  let fixture: ComponentFixture<ContentTopicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentTopicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
