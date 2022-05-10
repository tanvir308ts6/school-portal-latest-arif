import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadApplicationFormComponent } from './upload-application-form.component';

describe('UploadApplicationFormComponent', () => {
  let component: UploadApplicationFormComponent;
  let fixture: ComponentFixture<UploadApplicationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadApplicationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
