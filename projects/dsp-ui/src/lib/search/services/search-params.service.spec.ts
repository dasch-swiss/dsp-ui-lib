import { TestBed } from '@angular/core/testing';

import { SearchParamsService } from './search-params.service';

describe('SearchParamsService', () => {
  let service: SearchParamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchParamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
