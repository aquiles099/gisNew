import { TestBed } from '@angular/core/testing';

import { MapResolverService } from './map-resolver.service';

describe('MapResolverService', () => {
  let service: MapResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
