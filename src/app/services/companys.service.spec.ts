import { TestBed } from '@angular/core/testing';

import { CompanysService } from './companys.service';

describe('EmpresasService', () => {
  let service: CompanysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
