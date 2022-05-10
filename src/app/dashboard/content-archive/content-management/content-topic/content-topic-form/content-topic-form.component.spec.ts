import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentTopicFormComponent } from './content-topic-form.component';

describe('ContentTopicFormComponent', () => {
  let component: ContentTopicFormComponent;
  let fixture: ComponentFixture<ContentTopicFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentTopicFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentTopicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
