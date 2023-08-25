/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GoogledriveserviceService } from './googledriveservice.service';

describe('Service: Googledriveservice', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogledriveserviceService]
    });
  });

  it('should ...', inject([GoogledriveserviceService], (service: GoogledriveserviceService) => {
    expect(service).toBeTruthy();
  }));
});
