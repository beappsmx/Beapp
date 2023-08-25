/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { InstructorsService } from './instructors.service';

describe('Service: Instructors', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InstructorsService]
    });
  });

  it('should ...', inject([InstructorsService], (service: InstructorsService) => {
    expect(service).toBeTruthy();
  }));
});
