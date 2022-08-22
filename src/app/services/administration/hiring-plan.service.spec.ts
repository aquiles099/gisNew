import { TestBed } from '@angular/core/testing';

import { HiringPlanService } from './hiring-plan.service';

describe('HiringPlanService', () => {
  let service: HiringPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiringPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
