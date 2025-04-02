import { TestBed } from '@angular/core/testing';

import { DomusService } from './domus.service';

describe('DomusService', () => {
  let service: DomusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DomusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
