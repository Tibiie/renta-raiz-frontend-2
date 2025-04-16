import { TestBed } from '@angular/core/testing';

import { InmueblesService } from './inmuebles.service';

describe('InmueblesService', () => {
  let service: InmueblesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InmueblesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
