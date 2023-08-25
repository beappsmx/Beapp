import { TestBed } from '@angular/core/testing';

import { CheckbranchotherproccesService } from './chbranchothproc.service';

describe('CheckbranchotherproccesService', () => {
  let service: CheckbranchotherproccesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckbranchotherproccesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
