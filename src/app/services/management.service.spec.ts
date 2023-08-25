/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ManagementService } from './management.service';

describe('Service: Management', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManagementService]
    });
  });

  it('should ...', inject([ManagementService], (service: ManagementService) => {
    expect(service).toBeTruthy();
  }));
});
