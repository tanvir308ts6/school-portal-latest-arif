import { TestBed } from '@angular/core/testing';

import { DataComService } from './data-com.service';

describe('DataComService', () => {
  let service: DataComService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataComService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
