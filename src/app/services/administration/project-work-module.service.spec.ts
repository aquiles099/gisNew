import { TestBed } from '@angular/core/testing';

import { ProjectWorkModuleService } from './project-work-module.service';

describe('ProjectWorkModuleService', () => {
  let service: ProjectWorkModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectWorkModuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
