import { TestBed } from '@angular/core/testing';

import { ProjectAccessService } from './project-access.service';

describe('ProjectAccessService', () => {
  let service: ProjectAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
