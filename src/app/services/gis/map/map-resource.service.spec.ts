import { TestBed } from '@angular/core/testing';

import { MapResourceService } from './map-resource.service';

describe('MapResourceService', () => {
  let service: MapResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
