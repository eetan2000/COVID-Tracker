import { TestBed } from '@angular/core/testing';

import { CaseServiceService } from './case-service.service';

describe('CaseServiceService', () => {
  let service: CaseServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaseServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
