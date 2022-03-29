import { TestBed } from '@angular/core/testing';

import { ArxisFireAuthService } from './fire-auth.service';

describe('ArxisFireAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArxisFireAuthService = TestBed.get(ArxisFireAuthService);
    expect(service).toBeTruthy();
  });
});
