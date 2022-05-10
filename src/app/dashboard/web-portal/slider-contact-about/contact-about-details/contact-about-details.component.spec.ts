import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAboutDetailsComponent } from './contact-about-details.component';

describe('ContactAboutDetailsComponent', () => {
  let component: ContactAboutDetailsComponent;
  let fixture: ComponentFixture<ContactAboutDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactAboutDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAboutDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
