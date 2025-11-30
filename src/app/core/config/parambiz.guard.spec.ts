import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { parambizGuard } from './parambiz.guard';

describe('parambizGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => parambizGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
