import { TestBed } from '@angular/core/testing';

import { GisToolGroupService } from './gis-tool-group.service';

describe('GisToolGroupService', () => {
  let service: GisToolGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GisToolGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
