import { TestBed } from '@angular/core/testing';

import { TableResolverService } from './table-resolver.service';

describe('TableResolverService', () => {
  let service: TableResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
