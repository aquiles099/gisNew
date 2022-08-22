import { TestBed } from '@angular/core/testing';

import { DetailsResolverService } from './details-resolver.service';

describe('DetailsResolverService', () => {
  let service: DetailsResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailsResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
