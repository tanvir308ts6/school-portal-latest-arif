import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSolutionListComponent } from './view-solution-list.component';

describe('ViewSolutionListComponent', () => {
  let component: ViewSolutionListComponent;
  let fixture: ComponentFixture<ViewSolutionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSolutionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSolutionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
