import { TestBed } from '@angular/core/testing';

import { DashInterestedService } from './dash-interested.service';

describe('DashInterestedService', () => {
  let service: DashInterestedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashInterestedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
