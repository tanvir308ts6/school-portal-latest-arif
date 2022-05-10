import { TestBed } from '@angular/core/testing';

import { SessionDataPassService } from './session-data-pass.service';

describe('SessionDataPassService', () => {
  let service: SessionDataPassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionDataPassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
