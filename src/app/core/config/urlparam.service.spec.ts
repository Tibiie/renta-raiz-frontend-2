import { TestBed } from '@angular/core/testing';

import { UrlparamService } from './urlparam.service';

describe('UrlparamService', () => {
  let service: UrlparamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrlparamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
