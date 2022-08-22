import { TestBed } from '@angular/core/testing';

import { GisLayerService } from './gis-layer.service';

describe('GisLayerService', () => {
  let service: GisLayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GisLayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
