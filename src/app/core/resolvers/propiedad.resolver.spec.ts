import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { propiedadResolver } from './propiedad.resolver';

describe('propiedadResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => propiedadResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
