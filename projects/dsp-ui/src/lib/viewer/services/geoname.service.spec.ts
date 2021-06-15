import { TestBed } from '@angular/core/testing';

import { GeonameService } from './geoname.service';

describe('GeonameService', () => {
  let service: GeonameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeonameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
