import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { blogsResolver } from './blogs.resolver';

describe('blogsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => blogsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
