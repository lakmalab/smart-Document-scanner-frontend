import { TestBed } from '@angular/core/testing';

import { MobileTokenService } from './mobile-token-service';

describe('MobileTokenService', () => {
  let service: MobileTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MobileTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
