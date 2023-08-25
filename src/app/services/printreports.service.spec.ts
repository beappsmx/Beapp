/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PrintreportsService } from './printreports.service';

describe('Service: Printreports', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrintreportsService]
    });
  });

  it('should ...', inject([PrintreportsService], (service: PrintreportsService) => {
    expect(service).toBeTruthy();
  }));
});
