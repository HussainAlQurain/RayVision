import { TestBed } from '@angular/core/testing';

import { DotaService } from './dota.service';

describe('DotaService', () => {
  let service: DotaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DotaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
