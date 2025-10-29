import { TestBed } from '@angular/core/testing';

import { DataasesoresService } from './dataasesores.service';

describe('DataasesoresService', () => {
  let service: DataasesoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataasesoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
