/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LessonslearnedService } from './lessonslearned.service';

describe('Service: Lessonslearned', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LessonslearnedService]
    });
  });

  it('should ...', inject([LessonslearnedService], (service: LessonslearnedService) => {
    expect(service).toBeTruthy();
  }));
});
