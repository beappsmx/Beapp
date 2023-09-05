import { TestBed } from '@angular/core/testing';

import { PrintpdfService } from './printpdf.service';

describe('PrintpdfService', () => {
  let service: PrintpdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintpdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
