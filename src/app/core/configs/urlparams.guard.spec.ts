import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { urlparamsGuard } from './urlparams.guard';

describe('urlparamsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => urlparamsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
