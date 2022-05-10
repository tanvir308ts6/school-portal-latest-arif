import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarReuseComponent } from './sidebar-reuse.component';

describe('SidebarReuseComponent', () => {
  let component: SidebarReuseComponent;
  let fixture: ComponentFixture<SidebarReuseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarReuseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarReuseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
