import { TestBed } from '@angular/core/testing';

import { RequestedProjectService } from './requested-project.service';

describe('RequestedProjectService', () => {
  let service: RequestedProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestedProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
